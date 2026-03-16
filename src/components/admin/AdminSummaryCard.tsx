import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdminSummaryCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string;
  trend?: string;
  trendColor?: string;
  onPress?: () => void;
}

export const AdminSummaryCard: React.FC<AdminSummaryCardProps> = ({
  icon,
  iconColor,
  iconBg,
  title,
  value,
  trend,
  trendColor = '#10B981', // emerald-500
  onPress,
}) => {
  return (
    <Pressable 
      onPress={onPress}
      disabled={!onPress}
      className={`bg-white rounded-[24px] p-5 mb-4 shadow-sm border border-lora-border/30 active:opacity-70`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View 
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        
        {trend && (
          <Text 
            className="text-[13px] font-InterBold" 
            style={{ color: trendColor }}
          >
            {trend}
          </Text>
        )}
      </View>
      
      <Text className="text-lora-text-muted text-[13px] font-InterMedium mb-1">{title}</Text>
      <Text className="text-lora-text text-2xl font-InterBold">{value}</Text>
    </Pressable>
  );
};
