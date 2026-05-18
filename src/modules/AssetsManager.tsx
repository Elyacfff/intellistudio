import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';
import {
  Folder,
  Image as ImageIcon,
  Music,
  Users,
  Upload,
  Search,
  Star,
  Grid,
  List
} from 'lucide-react';

interface AssetItem {
  id: number;
  name: string;
  type: 'image' | 'audio' | 'character';
  thumbnail: string;
  size: string;
  date: string;
  tags: string[];
  favorite: boolean;
}

const AssetsManager: React.FC = () => {
  const { theme } = useAppStore();
  const colors = themes[theme];
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'character'>('all');
  
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: 1, name: '女主角头像.png', type: 'image', thumbnail: '', size: '2.4 MB', date: '2024-05-10', tags: ['人物', '头像'], favorite: true },
    { id: 2, name: '咖啡店背景.jpg', type: 'image', thumbnail: '', size: '5.2 MB', date: '2024-05-09', tags: ['场景', '背景'], favorite: false },
    { id: 3, name: '林小雨 声音.mp3', type: 'audio', thumbnail: '', size: '800 KB', date: '2024-05-08', tags: ['声音', '配音'], favorite: true },
    { id: 4, name: '男主角人设.png', type: 'character', thumbnail: '', size: '1.8 MB', date: '2024-05-07', tags: ['人设', '角色'], favorite: false },
  ]);

  const toggleFavorite = (id: number) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, favorite: !asset.favorite } : asset
    ));
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ color: colors.title }}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Folder size={20} style={{ color: colors.primary }} />
            素材库
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search size={16} style={{ color: colors.muted, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="搜索素材..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: colors.input, color: colors.body, border: `1px solid ${colors.border}`, width: 240 }}
            />
          </div>
          
          {/* 视图切换 */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: colors.input }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5 rounded-md transition-all"
              style={{ backgroundColor: viewMode === 'grid' ? `${colors.primary}20` : 'transparent', color: viewMode === 'grid' ? colors.primary : colors.muted }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded-md transition-all"
              style={{ backgroundColor: viewMode === 'list' ? `${colors.primary}20` : 'transparent', color: viewMode === 'list' ? colors.primary : colors.muted }}
            >
              <List size={16} />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-80" style={{ backgroundColor: colors.primary, color: '#fff' }}>
            <Upload size={16} />
            上传素材
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧分类 */}
        <div className="w-56 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <h3 className="font-semibold text-sm">分类</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-all ${selectedType === 'all' ? 'ring-1' : ''}`}
              style={{
                backgroundColor: selectedType === 'all' ? `${colors.primary}20` : 'transparent',
                borderColor: selectedType === 'all' ? colors.primary : 'transparent',
                color: selectedType === 'all' ? colors.primary : colors.body
              }}
            >
              <Folder size={18} />
              <span className="text-sm font-medium">全部素材</span>
            </button>
            
            <button
              onClick={() => setSelectedType('image')}
              className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-all ${selectedType === 'image' ? 'ring-1' : ''}`}
              style={{
                backgroundColor: selectedType === 'image' ? `${colors.primary}20` : 'transparent',
                borderColor: selectedType === 'image' ? colors.primary : 'transparent',
                color: selectedType === 'image' ? colors.primary : colors.body
              }}
            >
              <ImageIcon size={18} />
              <span className="text-sm font-medium">图片素材</span>
            </button>
            
            <button
              onClick={() => setSelectedType('audio')}
              className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-all ${selectedType === 'audio' ? 'ring-1' : ''}`}
              style={{
                backgroundColor: selectedType === 'audio' ? `${colors.primary}20` : 'transparent',
                borderColor: selectedType === 'audio' ? colors.primary : 'transparent',
                color: selectedType === 'audio' ? colors.primary : colors.body
              }}
            >
              <Music size={18} />
              <span className="text-sm font-medium">音频素材</span>
            </button>
            
            <button
              onClick={() => setSelectedType('character')}
              className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center gap-3 transition-all ${selectedType === 'character' ? 'ring-1' : ''}`}
              style={{
                backgroundColor: selectedType === 'character' ? `${colors.primary}20` : 'transparent',
                borderColor: selectedType === 'character' ? colors.primary : 'transparent',
                color: selectedType === 'character' ? colors.primary : colors.body
              }}
            >
              <Users size={18} />
              <span className="text-sm font-medium">角色素材</span>
            </button>
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] cursor-pointer group"
                  style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
                >
                  <div className="aspect-square flex items-center justify-center" style={{ backgroundColor: colors.input }}>
                    {asset.type === 'image' && <ImageIcon size={40} style={{ color: colors.muted, opacity: 0.5 }} />}
                    {asset.type === 'audio' && <Music size={40} style={{ color: colors.muted, opacity: 0.5 }} />}
                    {asset.type === 'character' && <Users size={40} style={{ color: colors.muted, opacity: 0.5 }} />}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium truncate" style={{ color: colors.title }}>{asset.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(asset.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star
                          size={14}
                          fill={asset.favorite ? colors.primary : 'none'}
                          style={{ color: asset.favorite ? colors.primary : colors.muted }}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: colors.muted }}>
                      <span>{asset.size}</span>
                      <span>{asset.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: colors.border }}>
                    <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>名称</th>
                    <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>类型</th>
                    <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>大小</th>
                    <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>日期</th>
                    <th className="text-left py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>标签</th>
                    <th className="text-right py-3 px-4 text-xs font-medium" style={{ color: colors.muted }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-opacity-50" style={{ borderColor: colors.border }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {asset.type === 'image' && <ImageIcon size={16} style={{ color: colors.muted }} />}
                          {asset.type === 'audio' && <Music size={16} style={{ color: colors.muted }} />}
                          {asset.type === 'character' && <Users size={16} style={{ color: colors.muted }} />}
                          <span className="text-sm font-medium" style={{ color: colors.title }}>{asset.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                          {asset.type === 'image' ? '图片' : asset.type === 'audio' ? '音频' : '角色'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: colors.body }}>{asset.size}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: colors.body }}>{asset.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {asset.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.input, color: colors.muted }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 rounded hover:opacity-80" style={{ color: colors.muted }}>
                          <Star size={14} fill={asset.favorite ? colors.primary : 'none'} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsManager;