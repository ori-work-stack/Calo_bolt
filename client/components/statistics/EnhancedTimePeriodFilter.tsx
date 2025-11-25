import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type TimePeriod = "week" | "month" | "3months";

interface EnhancedTimePeriodFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export const EnhancedTimePeriodFilter: React.FC<EnhancedTimePeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods = [
    { key: "week" as const, label: "Week" },
    { key: "month" as const, label: "Month" },
    { key: "3months" as const, label: "3 Months" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={styles.filterButton}
            onPress={() => onPeriodChange(period.key)}
            activeOpacity={0.8}
          >
            {selectedPeriod === period.key ? (
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.activeGradient}
              >
                <Text style={styles.activeText}>{period.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveButton}>
                <Text style={styles.inactiveText}>{period.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filterButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  activeGradient: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  inactiveButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  activeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  inactiveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
});
