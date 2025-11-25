import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Droplets,
  Flame,
  Apple,
  Zap,
  Award,
  Target,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { nutritionAPI, calendarAPI } from "@/src/services/api";
import useOptimizedAuthSelector from "@/hooks/useOptimizedAuthSelector";
import { EnhancedMetricCard } from "@/components/statistics/EnhancedMetricCard";
import { EnhancedTimePeriodFilter } from "@/components/statistics/EnhancedTimePeriodFilter";
import { AchievementsSection } from "@/components/statistics/AchievementsSection";
import { AIRecommendationsSection } from "@/components/statistics/AIRecommendationsSection";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

type TimePeriod = "week" | "month" | "3months";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}

interface StatsData {
  current: NutritionData;
  goals: NutritionData;
  trends: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
}

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const { user } = useOptimizedAuthSelector((state) => state.auth);

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState<StatsData>({
    current: { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 },
    goals: { calories: 2000, protein: 150, carbs: 250, fats: 67, water: 2000 },
    trends: { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 },
  });
  const [calendarStats, setCalendarStats] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const today = new Date();
      const now = today.toISOString().split("T")[0];

      let startDate = new Date();
      if (selectedPeriod === "week") {
        startDate.setDate(today.getDate() - 7);
      } else if (selectedPeriod === "month") {
        startDate.setMonth(today.getMonth() - 1);
      } else {
        startDate.setMonth(today.getMonth() - 3);
      }
      const start = startDate.toISOString().split("T")[0];

      const [statsResult, calendarResult, usageResult, waterResult] = await Promise.allSettled([
        nutritionAPI.getRangeStatistics(start, now).catch(() => ({ data: null })),
        calendarAPI.getStatistics(today.getFullYear(), today.getMonth() + 1).catch(() => null),
        nutritionAPI.getUsageStats().catch(() => null),
        nutritionAPI.getWaterIntake(now).catch(() => ({ cups_consumed: 0 })),
      ]);

      const stats = statsResult.status === "fulfilled" ? statsResult.value?.data : null;
      const calendar = calendarResult.status === "fulfilled" ? calendarResult.value : null;
      const usage = usageResult.status === "fulfilled" ? usageResult.value : null;
      const water = waterResult.status === "fulfilled" ? waterResult.value : { cups_consumed: 0 };

      if (stats) {
        setStatsData({
          current: {
            calories: Math.round(stats.average_calories || 0),
            protein: Math.round(stats.average_protein_g || 0),
            carbs: Math.round(stats.average_carbs_g || 0),
            fats: Math.round(stats.average_fats_g || 0),
            water: Math.round((water?.cups_consumed || 0) * 250),
          },
          goals: {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fats: 67,
            water: 2000,
          },
          trends: {
            calories: Math.random() * 20 - 10,
            protein: Math.random() * 20 - 10,
            carbs: Math.random() * 20 - 10,
            fats: Math.random() * 20 - 10,
            water: Math.random() * 20 - 10,
          },
        });
      }

      setCalendarStats(calendar);
      setUsageStats(usage);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const metrics = useMemo(() => [
    {
      id: "calories",
      title: "Calories",
      value: statsData.current.calories,
      goal: statsData.goals.calories,
      unit: "kcal",
      trend: statsData.trends.calories,
      icon: Flame,
      color: "#EF4444",
      gradient: ["#EF4444", "#DC2626"],
    },
    {
      id: "protein",
      title: "Protein",
      value: statsData.current.protein,
      goal: statsData.goals.protein,
      unit: "g",
      trend: statsData.trends.protein,
      icon: Apple,
      color: "#10B981",
      gradient: ["#10B981", "#059669"],
    },
    {
      id: "carbs",
      title: "Carbs",
      value: statsData.current.carbs,
      goal: statsData.goals.carbs,
      unit: "g",
      trend: statsData.trends.carbs,
      icon: Activity,
      color: "#F59E0B",
      gradient: ["#F59E0B", "#D97706"],
    },
    {
      id: "fats",
      title: "Fats",
      value: statsData.current.fats,
      goal: statsData.goals.fats,
      unit: "g",
      trend: statsData.trends.fats,
      icon: Droplets,
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#7C3AED"],
    },
    {
      id: "water",
      title: "Hydration",
      value: statsData.current.water,
      goal: statsData.goals.water,
      unit: "ml",
      trend: statsData.trends.water,
      icon: Droplets,
      color: "#3B82F6",
      gradient: ["#3B82F6", "#2563EB"],
    },
  ], [statsData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading your statistics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC", "#F1F5F9"]}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
              colors={["#10B981"]}
            />
          }
        >
          <View style={styles.header}>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text style={styles.greeting}>Hello, {user?.full_name || "User"}</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <Text style={styles.title}>Your Nutrition Stats</Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <EnhancedTimePeriodFilter
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </Animated.View>

          <View style={styles.statsGrid}>
            {metrics.map((metric, index) => (
              <Animated.View
                key={metric.id}
                entering={FadeInDown.delay(400 + index * 100).springify()}
              >
                <EnhancedMetricCard metric={metric} />
              </Animated.View>
            ))}
          </View>

          {calendarStats && (
            <Animated.View entering={FadeInDown.delay(900).springify()}>
              <View style={styles.insightsCard}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.insightsGradient}
                >
                  <View style={styles.insightsHeader}>
                    <View style={styles.insightsIconContainer}>
                      <Target size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.insightsTitle}>Monthly Progress</Text>
                  </View>
                  <Text style={styles.insightsValue}>
                    {calendarStats.monthlyProgress || 0}%
                  </Text>
                  <Text style={styles.insightsSubtitle}>
                    {calendarStats.totalGoalDays || 0} days goal achieved
                  </Text>
                  {calendarStats.motivationalMessage && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.messageText}>
                        {calendarStats.motivationalMessage}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </View>
            </Animated.View>
          )}

          {usageStats && (
            <Animated.View entering={FadeInDown.delay(1000).springify()}>
              <View style={styles.usageCard}>
                <View style={styles.usageHeader}>
                  <View style={styles.usageIconContainer}>
                    <BarChart3 size={20} color="#10B981" />
                  </View>
                  <Text style={styles.usageTitle}>Usage Stats</Text>
                </View>
                <View style={styles.usageContent}>
                  <View style={styles.usageItem}>
                    <Text style={styles.usageLabel}>Meal Scans</Text>
                    <Text style={styles.usageValue}>
                      {usageStats.meal_scans_used || 0} / {usageStats.meal_scans_limit || 100}
                    </Text>
                  </View>
                  <View style={styles.usageItem}>
                    <Text style={styles.usageLabel}>AI Requests</Text>
                    <Text style={styles.usageValue}>
                      {usageStats.ai_requests_used || 0} / {usageStats.ai_requests_limit || 1000}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(1100).springify()}>
            <AchievementsSection />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1200).springify()}>
            <AIRecommendationsSection />
          </Animated.View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  insightsCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  insightsGradient: {
    padding: 24,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  insightsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  insightsValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
  },
  insightsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  messageContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  usageCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  usageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  usageIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  usageContent: {
    gap: 12,
  },
  usageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  usageLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  usageValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  bottomPadding: {
    height: 40,
  },
});
