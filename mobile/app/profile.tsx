import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ApiError, getAuthToken } from "../services/api";
import { getMe } from "../services/authService";
import {
  ALLOWED_CATEGORIES,
  COMPANY_CATEGORY_MAP,
  KycCompany,
  calculateKycCompletion,
  getKyc,
  updateKyc,
} from "../services/kycService";

type CompanyForm = {
  category: string;
  company: string;
  partnerId: string;
  dashboardScreenshot: string;
};

type KycForm = {
  aadhaar: string;
  pan: string;
  photo: string;
  city: string;
  age: string;
  avgWeeklyIncome: string;
  avgWorkingHours: string;
  companies: CompanyForm[];
};

type UserIdentity = {
  fullName: string;
  mobile: string;
  email: string;
};

const DEFAULT_CATEGORY = ALLOWED_CATEGORIES[0] || "Food Delivery";

const createEmptyCompany = (category: string): CompanyForm => ({
  category,
  company: "",
  partnerId: "",
  dashboardScreenshot: "",
});

const EMPTY_FORM: KycForm = {
  aadhaar: "",
  pan: "",
  photo: "",
  city: "",
  age: "",
  avgWeeklyIncome: "",
  avgWorkingHours: "",
  companies: [],
};

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const asTrimmedString = (value: unknown): string => asString(value).trim();

const toNumberOrUndefined = (value: string): number | undefined => {
  const normalized = value.trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default function ProfileScreen() {
  const [form, setForm] = useState<KycForm>(EMPTY_FORM);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [kycStatus, setKycStatus] = useState("not_started");
  const [identity, setIdentity] = useState<UserIdentity>({
    fullName: "User",
    mobile: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [logOnNextStateCommit, setLogOnNextStateCommit] = useState(false);

  const completion = useMemo(() => {
    const kycLikeData = {
      aadhaar: form.aadhaar,
      pan: form.pan,
      photo: form.photo,
      city: form.city,
      age: toNumberOrUndefined(form.age),
      avgWeeklyIncome: toNumberOrUndefined(form.avgWeeklyIncome),
      avgWorkingHours: toNumberOrUndefined(form.avgWorkingHours),
    };

    return calculateKycCompletion(kycLikeData, form.companies as KycCompany[]);
  }, [form]);

  const percentage = completion.percentage;
  const isComplete = percentage === 100;

  useEffect(() => {
    if (logOnNextStateCommit) {
      console.log("[KYC] State after setting data:", form);
      setLogOnNextStateCommit(false);
    }
  }, [form, logOnNextStateCommit]);

  const loadKyc = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);

      const token = await getAuthToken();
      if (!token) {
        setErrorMessage("Session missing. Please login again.");
        setForm(EMPTY_FORM);
        return;
      }

      const [kyc, meData] = await Promise.all([getKyc(), getMe()]);

      const user = meData?.user as Record<string, unknown> | undefined;
      setIdentity({
        fullName: asTrimmedString(user?.fullName) || "User",
        mobile: asTrimmedString(user?.mobile),
        email: asTrimmedString(user?.email),
      });

      setKycStatus(asTrimmedString(kyc?.status) || "not_started");

      const sourceCompanies = Array.isArray(kyc?.companies) ? kyc.companies : [];
      const normalizedCompanies: CompanyForm[] = sourceCompanies.map((company) => ({
        category: asTrimmedString(company.category),
        company: asTrimmedString(company.company),
        partnerId: asString(company.partnerId),
        dashboardScreenshot: asString(company.dashboardScreenshot),
      }));

      const inferredCategory =
        normalizedCompanies[0]?.category && ALLOWED_CATEGORIES.includes(normalizedCompanies[0].category)
          ? normalizedCompanies[0].category
          : DEFAULT_CATEGORY;

      const normalizedForm: KycForm = {
        aadhaar: asString(kyc?.aadhaar),
        pan: asString(kyc?.pan),
        photo: asString(kyc?.photo),
        city: asString(kyc?.city || kyc?.location),
        age: asString(kyc?.age),
        avgWeeklyIncome: asString(kyc?.avgWeeklyIncome),
        avgWorkingHours: asString(kyc?.avgWorkingHours),
        companies: normalizedCompanies.map((company) => ({
          ...company,
          category: company.category || inferredCategory,
        })),
      };

      console.log("[KYC] API response mapped to form:", normalizedForm);
      setSelectedCategory(inferredCategory);
      setLogOnNextStateCommit(true);
      setForm(normalizedForm);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("Unauthorized. Please login again.");
      } else if (error instanceof ApiError) {
        setErrorMessage(error.message || "Failed to load KYC profile.");
      } else {
        setErrorMessage("Failed to load KYC profile.");
      }
      setKycStatus("not_started");
      setForm(EMPTY_FORM);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const updateBasicField = (field: keyof Omit<KycForm, "companies">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCompanyField = (index: number, field: keyof CompanyForm, value: string) => {
    setForm((prev) => {
      const nextCompanies = [...prev.companies];
      nextCompanies[index] = { ...nextCompanies[index], [field]: value };
      return { ...prev, companies: nextCompanies };
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setForm((prev) => ({
      ...prev,
      companies: prev.companies.map((company) => ({
        ...company,
        category,
        company: COMPANY_CATEGORY_MAP[category]?.includes(company.company) ? company.company : "",
      })),
    }));
  };

  const addCompany = () => {
    setForm((prev) => ({
      ...prev,
      companies: [...prev.companies, createEmptyCompany(selectedCategory)],
    }));
  };

  const removeCompany = (index: number) => {
    setForm((prev) => ({
      ...prev,
      companies: prev.companies.filter((_, companyIndex) => companyIndex !== index),
    }));
  };

  const validateBeforeSubmit = (): string | null => {
    if (!Array.isArray(form.companies) || form.companies.length === 0) {
      return "At least one company is required.";
    }

    for (let index = 0; index < form.companies.length; index += 1) {
      const company = form.companies[index];
      if (!asTrimmedString(company.category)) {
        return `Company ${index + 1}: category is required.`;
      }
      if (!asTrimmedString(company.company)) {
        return `Company ${index + 1}: company is required.`;
      }
      if (!asTrimmedString(company.partnerId)) {
        return `Company ${index + 1}: partner ID is required.`;
      }
      if (!asTrimmedString(company.dashboardScreenshot)) {
        return `Company ${index + 1}: dashboard screenshot is required.`;
      }
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateBeforeSubmit();
    if (validationError) {
      setErrorMessage(validationError);
      Alert.alert("Validation", validationError);
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const token = await getAuthToken();
      if (!token) {
        setErrorMessage("Session missing. Please login again.");
        return;
      }

      const payload = {
        aadhaar: form.aadhaar.trim(),
        pan: form.pan.trim(),
        photo: form.photo.trim(),
        city: form.city.trim(),
        age: toNumberOrUndefined(form.age),
        avgWeeklyIncome: toNumberOrUndefined(form.avgWeeklyIncome),
        avgWorkingHours: toNumberOrUndefined(form.avgWorkingHours),
        companies: form.companies.map((company) => ({
          category: company.category.trim(),
          company: company.company.trim(),
          partnerId: company.partnerId.trim(),
          dashboardScreenshot: company.dashboardScreenshot.trim(),
        })),
      };

      console.log("[KYC] Payload before update:", payload);
      const result = await updateKyc(payload);
      setSuccessMessage(result?.message || "KYC updated successfully.");
      await loadKyc();
      Alert.alert("Success", "KYC updated successfully.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("Unauthorized. Please login again.");
      } else if (error instanceof ApiError) {
        setErrorMessage(error.message || "Failed to update KYC.");
      } else {
        setErrorMessage("Failed to update KYC.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#2563eb" />
          <Text className="mt-3 text-xs font-bold text-slate-500">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categoryCompanies = COMPANY_CATEGORY_MAP[selectedCategory] || [];
  const statusLabelMap: Record<string, string> = {
    approved: "Identity Verified & Active",
    pending: "Identity Under Review",
    partial: "Identity Partially Submitted",
    rejected: "Identity Rejected",
    not_started: "Identity Setup Required",
  };
  const statusDescriptionMap: Record<string, string> = {
    approved: "Your algorithmic parameters and legal documents are fully synced with the protocol.",
    pending: "Your submitted identity payload is under verification with the compliance protocol.",
    partial: "Some KYC fields are still missing. Complete the form below to unlock full verification.",
    rejected: "Your last verification attempt was rejected. Please correct and resubmit your details.",
    not_started: "Start submitting your KYC data below to activate verification and protection buffers.",
  };
  const normalizedStatus = kycStatus in statusLabelMap ? kycStatus : "not_started";
  const statusLabel = statusLabelMap[normalizedStatus];
  const statusDescription = statusDescriptionMap[normalizedStatus];
  const statusIsVerified = normalizedStatus === "approved";

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 py-5">
          <View className="bg-white rounded-[40px] p-7 border border-slate-100 shadow-sm shadow-slate-200/60 mb-5">
            <View className="items-center mb-6">
              <View className="w-28 h-28 rounded-full border-4 border-emerald-100 bg-emerald-950 items-center justify-center mb-4 shadow-lg shadow-slate-200">
                <Feather name="user" size={46} color="#d1fae5" />
              </View>
              <Text className="text-3xl font-black text-slate-900 text-center">{identity.fullName || "User"}</Text>
              <Text className={`text-[11px] font-black uppercase tracking-widest mt-1 ${statusIsVerified ? "text-emerald-500" : "text-amber-600"}`}>
                {statusIsVerified ? "Verified Operative" : "Verification Pending"}
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Contact</Text>
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 items-center justify-center">
                    <Feather name="smartphone" size={18} color="#94a3b8" />
                  </View>
                  <View className="flex-1 h-12 rounded-2xl bg-slate-100 border border-slate-200 px-4 justify-center">
                    <Text className="text-slate-900 font-extrabold text-lg">{identity.mobile || "Not available"}</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Intel</Text>
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 items-center justify-center">
                    <Feather name="mail" size={18} color="#94a3b8" />
                  </View>
                  <View className="flex-1 h-12 rounded-2xl bg-slate-100 border border-slate-200 px-4 justify-center">
                    <Text className="text-slate-900 font-extrabold text-lg" numberOfLines={1}>{identity.email || "Not available"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className={`rounded-3xl p-5 mb-5 border ${statusIsVerified ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-row items-start gap-3 flex-1">
                <View className={`w-11 h-11 rounded-2xl items-center justify-center border ${statusIsVerified ? "bg-emerald-100 border-emerald-200" : "bg-amber-100 border-amber-200"}`}>
                  <Feather name={statusIsVerified ? "check-circle" : "shield"} size={20} color={statusIsVerified ? "#059669" : "#d97706"} />
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-black text-slate-900 leading-tight">{statusLabel}</Text>
                  <Text className={`text-sm font-semibold mt-1 ${statusIsVerified ? "text-emerald-800" : "text-amber-800"}`}>
                    {statusDescription}
                  </Text>
                  <Text className={`text-xs font-black uppercase tracking-wider mt-2 ${statusIsVerified ? "text-emerald-600" : "text-amber-600"}`}>
                    KYC Status: {normalizedStatus.replace("_", " ")} | Completion: {percentage}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-slate-900 mb-1">KYC Form</Text>
          <Text className="text-xs text-slate-500 font-bold mb-4">Review and update your KYC details below.</Text>

          {errorMessage ? (
            <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-xs font-bold text-red-700">{errorMessage}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4">
              <Text className="text-xs font-bold text-emerald-700">{successMessage}</Text>
            </View>
          ) : null}

          {!isComplete && (
            <View className="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-5">
              <Text className="text-[10px] uppercase font-extrabold tracking-widest text-amber-700 mb-2">KYC Progress</Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-extrabold text-slate-900">Completion</Text>
                <Text className="text-sm font-extrabold text-blue-600">{percentage}%</Text>
              </View>
              <View className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <View className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
              </View>
            </View>
          )}

          <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-5">
            <Text className="text-base font-extrabold text-slate-900 mb-4">Basic Details</Text>
            <InputField
              label="Aadhaar"
              value={form.aadhaar}
              onChangeText={(value) => updateBasicField("aadhaar", value)}
              placeholder="Enter Aadhaar"
            />
            <InputField
              label="PAN"
              value={form.pan}
              onChangeText={(value) => updateBasicField("pan", value)}
              placeholder="Enter PAN"
            />
            <InputField
              label="Photo URL"
              value={form.photo}
              onChangeText={(value) => updateBasicField("photo", value)}
              placeholder="https://..."
              autoCapitalize="none"
            />
            <InputField
              label="City"
              value={form.city}
              onChangeText={(value) => updateBasicField("city", value)}
              placeholder="Enter city"
            />
            <InputField
              label="Age"
              value={form.age}
              onChangeText={(value) => updateBasicField("age", value)}
              placeholder="Age"
              keyboardType="number-pad"
            />
            <InputField
              label="Average Weekly Income"
              value={form.avgWeeklyIncome}
              onChangeText={(value) => updateBasicField("avgWeeklyIncome", value)}
              placeholder="e.g. 12000"
              keyboardType="decimal-pad"
            />
            <InputField
              label="Average Working Hours"
              value={form.avgWorkingHours}
              onChangeText={(value) => updateBasicField("avgWorkingHours", value)}
              placeholder="e.g. 48"
              keyboardType="decimal-pad"
            />
          </View>

          <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-5">
            <Text className="text-base font-extrabold text-slate-900 mb-3">Company Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {ALLOWED_CATEGORIES.map((category) => {
                const active = category === selectedCategory;
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleCategoryChange(category)}
                    className={`px-3 py-2 rounded-xl border ${active ? "bg-blue-600 border-blue-600" : "bg-slate-50 border-slate-200"}`}
                  >
                    <Text className={`text-[11px] font-bold ${active ? "text-white" : "text-slate-700"}`}>{category}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-extrabold text-slate-900">Companies</Text>
              <TouchableOpacity onPress={addCompany} className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                <Text className="text-[11px] font-extrabold text-blue-700">+ Add Company</Text>
              </TouchableOpacity>
            </View>

            {form.companies.length === 0 ? (
              <Text className="text-xs font-bold text-slate-500 mb-3">
                No companies added yet. Add at least one company before submitting.
              </Text>
            ) : null}

            {form.companies.map((company, index) => (
              <View key={`${index}-${company.partnerId}`} className="mb-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-xs font-extrabold text-slate-700">Company {index + 1}</Text>
                  {form.companies.length > 1 ? (
                    <TouchableOpacity onPress={() => removeCompany(index)}>
                      <Text className="text-[11px] font-extrabold text-red-600">Remove</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Text className="text-[11px] font-bold text-slate-500 mb-1">Category</Text>
                <TextInput
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold mb-3"
                  value={company.category}
                  onChangeText={(value) => updateCompanyField(index, "category", value)}
                  editable={false}
                />

                <InputField
                  label="Company"
                  value={company.company}
                  onChangeText={(value) => updateCompanyField(index, "company", value)}
                  placeholder="Select or type company"
                />

                <View className="flex-row flex-wrap mb-3" style={{ gap: 8 }}>
                  {categoryCompanies.map((option) => {
                    const active = option === company.company;
                    return (
                      <TouchableOpacity
                        key={`${index}-${option}`}
                        onPress={() => updateCompanyField(index, "company", option)}
                        className={`px-3 py-2 rounded-xl border ${active ? "bg-blue-600 border-blue-600" : "bg-white border-slate-200"}`}
                      >
                        <Text className={`text-[11px] font-bold ${active ? "text-white" : "text-slate-700"}`}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <InputField
                  label="Partner ID"
                  value={company.partnerId}
                  onChangeText={(value) => updateCompanyField(index, "partnerId", value)}
                  placeholder="Enter partner ID"
                />
                <InputField
                  label="Dashboard Screenshot URL"
                  value={company.dashboardScreenshot}
                  onChangeText={(value) => updateCompanyField(index, "dashboardScreenshot", value)}
                  placeholder="https://..."
                  autoCapitalize="none"
                />
              </View>
            ))}
          </View>

          <PrimaryButton
            title={saving ? "Saving..." : "Save KYC"}
            onPress={handleSave}
            disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
