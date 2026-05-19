import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MemberLevel = 'free' | 'vip' | 'permanent';

export interface MemberInfo {
  level: MemberLevel;
  expireAt: string | null;
  purchasedAt: string | null;
  orderId: string | null;
}

interface PointState {
  points: number;
  totalEarned: number;
  member: MemberInfo;
  pointHistory: { amount: number; reason: string; time: string }[];
  dailySignIn: string | null;

  addPoints: (amount: number, reason: string) => void;
  deductPoints: (amount: number, reason: string) => boolean;
  dailyCheckIn: () => { success: boolean; earned: number; message: string };
  purchaseMembership: (level: MemberLevel) => { success: boolean; message: string };
  canUseFeature: (requiredLevel: MemberLevel) => boolean;
  getRemainingDays: () => number;
}

const PERMANENT_PRICE = 19;
const DAILY_SIGN_BONUS = 10;
const WEEKLY_STREAK_BONUS = 30;

const FREE_LIMITS = {
  scriptGen: 3,
  imageGen: 2,
  voiceGen: 2,
  dailyTotal: 5,
};

const VIP_LIMITS = {
  scriptGen: 20,
  imageGen: 15,
  voiceGen: 15,
  dailyTotal: 50,
};

const PERMANENT_LIMITS = {
  scriptGen: Infinity,
  imageGen: Infinity,
  voiceGen: Infinity,
  dailyTotal: Infinity,
};

export const getMemberLimits = (level: MemberLevel) => {
  if (level === 'permanent') return PERMANENT_LIMITS;
  if (level === 'vip') return VIP_LIMITS;
  return FREE_LIMITS;
};

export const usePointStore = create<PointState>()(
  persist(
    (set, get) => ({
      points: 50,
      totalEarned: 50,
      member: {
        level: 'free',
        expireAt: null,
        purchasedAt: null,
        orderId: null,
      },
      pointHistory: [
        { amount: 50, reason: '🎁 新用户注册赠送', time: new Date().toISOString() },
      ],
      dailySignIn: null,

      addPoints: (amount, reason) => {
        const state = get();
        set({
          points: state.points + amount,
          totalEarned: state.totalEarned + amount,
          pointHistory: [
            { amount, reason, time: new Date().toISOString() },
            ...state.pointHistory,
          ].slice(0, 100),
        });
      },

      deductPoints: (amount, reason) => {
        const state = get();
        if (state.points < amount) return false;
        set({
          points: state.points - amount,
          pointHistory: [
            { amount: -amount, reason, time: new Date().toISOString() },
            ...state.pointHistory,
          ].slice(0, 100),
        });
        return true;
      },

      dailyCheckIn: () => {
        const state = get();
        const today = new Date().toDateString();
        
        if (state.dailySignIn === today) {
          return { success: false, earned: 0, message: '今天已经签到过了' };
        }

        let bonus = DAILY_SIGN_BONUS;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (state.dailySignIn === yesterday) {
          bonus += WEEKLY_STREAK_BONUS;
          set({
            dailySignIn: today,
            points: state.points + bonus,
            totalEarned: state.totalEarned + bonus,
            pointHistory: [
              { amount: bonus, reason: `🔥 连续签到奖励 +${bonus} 积分`, time: new Date().toISOString() },
              ...state.pointHistory,
            ].slice(0, 100),
          });
          return { success: true, earned: bonus, message: `连续签到！获得 ${bonus} 积分` };
        }

        set({
          dailySignIn: today,
          points: state.points + bonus,
          totalEarned: state.totalEarned + bonus,
          pointHistory: [
            { amount: bonus, reason: `✅ 每日签到 +${bonus} 积分`, time: new Date().toISOString() },
            ...state.pointHistory,
          ].slice(0, 100),
        });
        return { success: true, earned: bonus, message: `签到成功！获得 ${bonus} 积分` };
      },

      purchaseMembership: (level) => {
        const state = get();
        const now = new Date().toISOString();

        if (level === 'permanent') {
          if (state.member.level === 'permanent') {
            return { success: false, message: '你已经是永久会员了' };
          }

          const orderId = 'VIP_PERMANENT_' + Date.now();
          set({
            points: state.points + 500,
            member: {
              level: 'permanent',
              expireAt: null,
              purchasedAt: now,
              orderId,
            },
            pointHistory: [
              { amount: 500, reason: '💎 永久会员赠送 500 积分', time: now },
              ...state.pointHistory,
            ].slice(0, 100),
          });
          return { success: true, message: '🎉 恭喜成为永久会员！' };
        }

        if (level === 'vip') {
          if (state.member.level === 'permanent') {
            return { success: false, message: '你已经是永久会员了' };
          }
          
          const expireAt = new Date(Date.now() + 30 * 86400000).toISOString();
          const orderId = 'VIP_MONTHLY_' + Date.now();
          set({
            points: state.points + 100,
            member: {
              level: 'vip',
              expireAt,
              purchasedAt: now,
              orderId,
            },
            pointHistory: [
              { amount: 100, reason: '⭐ 月度VIP赠送 100 积分', time: now },
              ...state.pointHistory,
            ].slice(0, 100),
          });
          return { success: true, message: '🎉 恭喜成为VIP会员！有效期30天' };
        }

        return { success: false, message: '无效的会员等级' };
      },

      canUseFeature: (requiredLevel) => {
        const state = get();
        if (state.member.level === 'permanent') return true;
        if (state.member.level === 'vip' && requiredLevel === 'free') return true;
        if (state.member.level === 'vip' && requiredLevel === 'vip') {
          if (state.member.expireAt && new Date(state.member.expireAt) < new Date()) {
            return false;
          }
          return true;
        }
        if (state.member.level === requiredLevel) return true;
        return false;
      },

      getRemainingDays: () => {
        const state = get();
        if (state.member.level === 'permanent') return Infinity;
        if (!state.member.expireAt) return 0;
        const remaining = new Date(state.member.expireAt).getTime() - Date.now();
        return Math.max(0, Math.ceil(remaining / 86400000));
      },
    }),
    {
      name: 'drama-points',
      partialize: (state) => ({
        points: state.points,
        totalEarned: state.totalEarned,
        member: state.member,
        pointHistory: state.pointHistory,
        dailySignIn: state.dailySignIn,
      }),
    }
  )
);