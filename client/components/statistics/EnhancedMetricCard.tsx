import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";

interface MetricProps {
  id: string;
  title: string;
  value: number;
  goal: number;
  unit: string;
  trend: number;
  icon: any;
  color: string;
  gradient: string[];
}

interface EnhancedMetricCardProps {
  metric: MetricProps;
}

export const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({ metric }) => {
  const Icon = metric.icon;
  const percentage = Math.min(Math.round((metric.value / metric.goal) * 100), 100);
  const isPositiveTrend = metric.trend > 0;
  const isNeutralTrend = metric.trend === 0;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
            <Icon size={24} color={metric.color} strokeWidth={2.5} />
          </View>
          <View style={styles.trendBadge}>
            {isNeutralTrend ? (
              <Minus size={14} color="#64748B" strokeWidth={3} />
            ) : isPositiveTrend ? (
              <TrendingUp size={14} color="#10B981" strokeWidth={3} />
            ) : (
              <TrendingDown size={14} color="#EF4444" strokeWidth={3} />
            )}
            <Text
              style={[
                styles.trendText,
                {
                  color: isNeutralTrend
                    ? "#64748B"
                    : isPositiveTrend
                    ? "#10B981"
                    : "#EF4444",
                },
              ]}
            >
              {isPositiveTrend ? "+" : ""}
              {metric.trend.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{metric.title}</Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: metric.color }]}>
              {metric.value.toLocaleString()}
            </Text>
            <Text style={styles.unit}>{metric.unit}</Text>
          </View>
          <Text style={styles.goal}>
            Goal: {metric.goal.toLocaleString()} {metric.unit}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <LinearGradient
              colors={metric.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${percentage}%` }]}
            />
          </View>
          <Text style={[styles.percentage, { color: metric.color }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
    marginLeft: 6,
  },
  goal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentage: {
    fontSize: 16,
    fontWeight: "800",
    minWidth: 50,
    textAlign: "right",
  },
});
