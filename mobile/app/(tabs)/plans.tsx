import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { getSubscription, paySubscription } from '../../services/subscriptionService';
import { getPricing, selectPricingPlan, type PlanType, type PricingPlan } from '../../services/pricingService';

type SubscriptionData = {
  planAmount: number;
  planName: string;
  totalPayments: number;
  duePayments: number;
  status: string;
  lastPaymentDate: string | null;
  startDate: string;
};

const PLAN_LABELS: Record<PlanType, string> = {
  basic: 'Basic Plan',
  standard: 'Standard Plan',
  premium: 'Premium Plan'
};

export default function PlansScreen() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlan = useMemo(() => {
    if (!selectedPlanType) return null;
    return plans.find((plan) => plan.planType === selectedPlanType) || null;
  }, [plans, selectedPlanType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionData, pricingData] = await Promise.all([getSubscription(), getPricing()]);
      setSubscription(subscriptionData);
      setPlans(Array.isArray(pricingData?.plans) ? pricingData.plans : []);
      setSelectedPlanType(pricingData?.selectedPlan?.planType || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load plans';
      Alert.alert('Pricing Unavailable', message);
      setPlans([]);
      setSelectedPlanType(null);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleSelectPlan = async (planType: PlanType) => {
    try {
      setIsProcessing(true);
      await selectPricingPlan(planType);
      await fetchData();
      Alert.alert('Plan Selected', `${PLAN_LABELS[planType]} activated.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to select plan';
      Alert.alert('Plan Selection Failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaySubscription = async () => {
    try {
      setIsProcessing(true);
      const result = await paySubscription();
      await fetchData();
      Alert.alert('Payment Successful', `Reference: ${result?.paymentRef || 'N/A'}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      Alert.alert('Payment Failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatINR = (value?: number) => {
    if (typeof value !== 'number' || value <= 0) return '--';
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="mt-8 mb-8">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-blue-50 border border-blue-100 flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg">
                <Feather name="shield" size={10} color="#2563eb" />
                <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  System Controlled Pricing
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">Choose Your Plan</Text>
            <Text className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
              Select one backend-generated plan. Premium payment always uses the selected plan price.
            </Text>

            {selectedPlan && (
              <TouchableOpacity
                onPress={handlePaySubscription}
                disabled={isProcessing}
                className="mt-4 self-start bg-emerald-600 px-4 py-2.5 rounded-xl"
              >
                <Text className="text-white text-[11px] font-extrabold uppercase tracking-widest">
                  {isProcessing ? 'Processing...' : `Pay ${formatINR(selectedPlan.price)}`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading && (
            <View className="items-center mb-4">
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          )}

          {!loading && plans.length === 0 && (
            <View className="bg-white rounded-3xl p-6 border border-slate-100">
              <Text className="text-base font-extrabold text-slate-800">Pricing unavailable</Text>
              <Text className="text-sm font-medium text-slate-500 mt-2">Try again after KYC approval or refresh this page.</Text>
            </View>
          )}

          {plans.map((plan) => {
            const isSelected = plan.planType === selectedPlanType;
            return (
              <View key={plan.planType} className={`rounded-[32px] p-6 mb-5 border ${isSelected ? 'bg-blue-600 border-blue-500' : 'bg-white border-slate-100'}`}>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {PLAN_LABELS[plan.planType]}
                  </Text>
                  {isSelected && (
                    <Text className="text-[10px] font-extrabold uppercase tracking-widest text-blue-100">Selected</Text>
                  )}
                </View>

                <Text className={`text-4xl font-extrabold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {formatINR(plan.price)}
                </Text>
                <Text className={`text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  Weekly Premium
                </Text>

                <View className={`mt-4 rounded-2xl px-4 py-3 ${isSelected ? 'bg-blue-500/30' : 'bg-slate-50'}`}>
                  <Text className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    Coverage: {formatINR(plan.benefitAmount)} claim benefit
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleSelectPlan(plan.planType)}
                  disabled={isProcessing}
                  className={`mt-5 py-3.5 rounded-2xl items-center ${isSelected ? 'bg-white' : 'bg-slate-900'}`}
                >
                  <Text className={`text-sm font-extrabold ${isSelected ? 'text-blue-700' : 'text-white'}`}>
                    {isProcessing ? 'Processing...' : isSelected ? 'Plan Selected' : `Select ${PLAN_LABELS[plan.planType]}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {subscription && (
            <View className="bg-white/60 border border-white rounded-[32px] p-6 mt-2">
              <Text className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Active Subscription</Text>
              <Text className="text-2xl font-extrabold text-slate-900 mt-2">{subscription.planName}</Text>
              <Text className="text-sm text-slate-500 font-medium mt-1">
                Paid: {subscription.totalPayments} | Due: {subscription.duePayments}
              </Text>
              <Text className="text-sm text-slate-500 font-medium mt-1">
                Last payment: {subscription.lastPaymentDate ? new Date(subscription.lastPaymentDate).toLocaleDateString() : 'Never'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
