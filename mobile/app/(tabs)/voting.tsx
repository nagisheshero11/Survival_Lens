"use client";

import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

type Tab = "support" | "supported" | "raised";
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type LocalImage = number;

type Claim = {
  id: string;
  icon: FeatherIconName;
  iconBg: string;
  iconColor: string;
  riskBg: string;
  riskText: string;
  title: string;
  desc: string;
  risk: string;
  statusLabel: string;
  progress: number;
  location: string;
  severity: string;
  details: string;
  image: LocalImage;
};

type Attachment = {
  id: string;
  uri: string;
  name: string;
};

type RaisedTicket = {
  id: string;
  title: string;
  severity: string;
  desc: string;
  location: string;
  status: string;
  submittedAt: string;
  images: Attachment[];
};

type TicketForm = {
  title: string;
  severity: string;
  description: string;
  location: string;
  images: Attachment[];
};

const CLAIMS: Claim[] = [
  {
    id: "CLM-9092",
    icon: "cloud-rain",
    iconBg: "bg-blue-50",
    iconColor: "#3b82f6",
    riskBg: "bg-blue-50",
    riskText: "text-blue-600",
    title: "Flash Flood Alert - Lower East Side",
    desc: "Water levels rising rapidly on 4th Ave making deliveries extremely hazardous. Seeking validation to trigger auto-protection for route #4A.",
    risk: "High Risk",
    statusLabel: "34% / 100%",
    progress: 34,
    location: "Lower East Side, Manhattan",
    severity: "High Risk",
    details: "Flooding is blocking storefront access and creating unsafe delivery conditions. Supporters are being asked to validate the route risk so protection payouts can be activated.",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "CLM-8831",
    icon: "shield",
    iconBg: "bg-red-50",
    iconColor: "#ef4444",
    riskBg: "bg-red-50",
    riskText: "text-red-600",
    title: "Arbitrary Deactivations Spiking",
    desc: "Multiple drivers reporting sudden account suspensions on Platform Z without appeal options. Seeking consensus to trigger legal fund.",
    risk: "Critical",
    statusLabel: "82% / 100%",
    progress: 82,
    location: "Platform Z Network",
    severity: "Critical",
    details: "Account suspensions are being reported without notice, review, or appeal. This ticket aggregates the latest reports and evidence to support network action.",
    image: require("../../assets/images/partial-react-logo.png"),
  },
  {
    id: "CLM-7712",
    icon: "activity",
    iconBg: "bg-orange-50",
    iconColor: "#f97316",
    riskBg: "bg-orange-50",
    riskText: "text-orange-600",
    title: "Algorithm Payout Suppression",
    desc: "Fare mapping shows a 15% reduction in base pay across all zones since the v4.0 app update. Need 100 signatures to dispute.",
    risk: "Medium Risk",
    statusLabel: "91% / 100%",
    progress: 91,
    location: "All active zones",
    severity: "Medium Risk",
    details: "The current payout mapping is returning lower base earnings across multiple routes after the v4.0 rollout. Community validation is requested before escalation.",
    image: require("../../assets/images/icon.png"),
  },
];

const SUPPORTED_CLAIMS = [
  {
    id: "CLM-6621",
    icon: "cloud-rain" as const,
    title: "Hurricane Base Payout",
    desc: "Emergency payout multipliers successfully dispensed to coastal drivers over 48 hours. Consensus reached and executed.",
  },
  {
    id: "CLM-5100",
    icon: "tool" as const,
    title: "Payment Gateway Crash",
    desc: "Bank API failure affected direct withdrawals. Loss of time completely buffered and credited to all active workers.",
  },
  {
    id: "CLM-4882",
    icon: "shield" as const,
    title: "City-Wide Curfew Active",
    desc: "Mandatory curfew restricted route operations for 12 hours. Platform losses fully reimbursed from the protection pool.",
  },
];

const INITIAL_FORM: TicketForm = {
  title: "",
  severity: "High Risk (Immediate payouts)",
  description: "",
  location: "",
  images: [],
};

function ClaimCard({
  claim,
  isSupported,
  onOpenDetails,
  onSupport,
}: {
  claim: Claim;
  isSupported: boolean;
  onOpenDetails: () => void;
  onSupport: () => void;
}) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
      <View className="flex-row items-start justify-between mb-4">
        <View className={`w-12 h-12 rounded-2xl ${claim.iconBg} items-center justify-center`}>
          <Feather name={claim.icon} size={20} color={claim.iconColor} />
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${claim.riskBg}`}>
          <Text className={`text-[9px] font-extrabold uppercase tracking-widest ${claim.riskText}`}>
            {claim.risk}
          </Text>
        </View>
      </View>

      <Text className="text-base font-extrabold text-slate-900 mb-1.5 leading-snug">
        {claim.title}
      </Text>
      <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
        {claim.desc}
      </Text>

      <View className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            Consensus Status
          </Text>
          <Text className="text-[9px] font-extrabold text-slate-900 uppercase tracking-widest">
            {claim.statusLabel}
          </Text>
        </View>
        <View className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <View className="h-full bg-slate-900 rounded-full" style={{ width: `${claim.progress}%` }} />
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity onPress={onOpenDetails} className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-200 items-center">
          <Text className="text-sm font-extrabold text-slate-600">Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSupport}
          disabled={isSupported}
          className={`flex-1 py-3.5 rounded-2xl items-center flex-row justify-center gap-2 ${isSupported ? "bg-emerald-600" : "bg-blue-600"}`}
        >
          <Feather name={isSupported ? "check-circle" : "thumbs-up"} size={14} color="white" />
          <Text className="text-sm font-extrabold text-white">{isSupported ? "Supported" : "Support"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SupportedCard({ claim }: { claim: typeof SUPPORTED_CLAIMS[0] }) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
      <View className="flex-row items-start justify-between mb-4">
        <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center">
          <Feather name={claim.icon} size={20} color="#10b981" />
        </View>
        <View className="px-2.5 py-1 rounded-lg bg-emerald-50">
          <Text className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600">
            Verified
          </Text>
        </View>
      </View>
      <Text className="text-base font-extrabold text-slate-900 mb-1.5">{claim.title}</Text>
      <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{claim.desc}</Text>
      <View className="flex-row items-center gap-3 pt-4 border-t border-slate-100">
        <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
          <Feather name="check-circle" size={16} color="#10b981" />
        </View>
        <View>
          <Text className="text-xs font-extrabold text-slate-900 leading-none">Your vote was recorded</Text>
          <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
            Consensus Executed
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function VotingScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("support");
  const [isRaising, setIsRaising] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Claim | RaisedTicket | null>(null);
  const [supported, setSupported] = useState<string[]>([]);
  const [raisedTickets, setRaisedTickets] = useState<RaisedTicket[]>([]);
  const [form, setForm] = useState<TicketForm>(INITIAL_FORM);

  const TABS: { key: Tab; label: string; badge?: string; badgeBg: string; badgeText: string }[] = [
    { key: "support", label: "Support", badge: "12", badgeBg: "bg-slate-900", badgeText: "text-white" },
    { key: "supported", label: "Supported", badge: "48", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700" },
    { key: "raised", label: "Raised", badge: String(raisedTickets.length), badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
  ];

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photo library to attach images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    const attachments = result.assets.map((asset, index) => ({
      id: `${asset.uri}-${index}`,
      uri: asset.uri,
      name: asset.fileName ?? `image-${index + 1}`,
    }));

    setForm((current) => ({
      ...current,
      images: [...current.images, ...attachments],
    }));
  }

  function submitTicket() {
    const ticket: RaisedTicket = {
      id: `TCK-${Date.now().toString().slice(-5)}`,
      title: form.title,
      severity: form.severity,
      desc: form.description,
      location: form.location,
      status: "Submitted for review",
      submittedAt: new Date().toLocaleString(),
      images: form.images,
    };

    setRaisedTickets((current) => [ticket, ...current]);
    setForm(INITIAL_FORM);
    setIsRaising(false);
    setActiveTab("raised");
  }

  const detailImages = selectedItem
    ? "submittedAt" in selectedItem
      ? selectedItem.images.map((image) => image.uri)
      : [selectedItem.image]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          <View className="flex-row items-start justify-between mt-6 mb-6">
            <View className="flex-1 mr-3">
              <View className="bg-blue-50 border border-blue-100 self-start px-2 py-1 rounded-lg mb-2">
                <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Decentralized Consensus
                </Text>
              </View>
              <Text className="text-3xl font-extrabold text-slate-900 leading-none mb-1">
                Voting Chamber
              </Text>
              <Text className="text-sm text-slate-500 font-medium">
                Validate community risk claims to trigger protective payouts.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsRaising(true)}
              className="bg-slate-900 px-4 py-3 rounded-2xl flex-row items-center gap-2 mt-1 shrink-0"
            >
              <Feather name="plus" size={15} color="white" />
              <Text className="text-white text-xs font-extrabold">Raise Ticket</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row border-b border-slate-200 mb-5">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-row items-center gap-1.5 pb-3 mr-5 ${activeTab === tab.key ? "border-b-2 border-slate-900" : ""}`}
              >
                <Text className={`text-sm font-extrabold ${activeTab === tab.key ? "text-slate-900" : "text-slate-400"}`}>
                  {tab.label}
                </Text>
                {tab.badge && (
                  <View className={`px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? tab.badgeBg : "bg-slate-100"}`}>
                    <Text className={`text-[9px] font-extrabold ${activeTab === tab.key ? tab.badgeText : "text-slate-500"}`}>
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "support" && CLAIMS.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              isSupported={supported.includes(claim.id)}
              onOpenDetails={() => setSelectedItem(claim)}
              onSupport={() => setSupported((current) => (current.includes(claim.id) ? current : [...current, claim.id]))}
            />
          ))}

          {activeTab === "supported" && SUPPORTED_CLAIMS.map((claim) => (
            <SupportedCard key={claim.id} claim={claim} />
          ))}

          {activeTab === "raised" && (
            <View>
              {raisedTickets.length === 0 ? (
                <View className="bg-white rounded-3xl p-8 border border-slate-100 items-center">
                  <View className="w-16 h-16 bg-blue-50 rounded-3xl items-center justify-center mb-4">
                    <Feather name="file-plus" size={26} color="#3b82f6" />
                  </View>
                  <Text className="text-lg font-extrabold text-slate-900 mb-2">No Active Tickets</Text>
                  <Text className="text-sm text-slate-500 font-medium text-center mb-6 leading-relaxed">
                    You haven&apos;t submitted any risk tickets to the network for validation yet.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsRaising(true)}
                    className="flex-row items-center gap-2 bg-slate-900 px-5 py-3 rounded-2xl"
                  >
                    <Text className="text-white text-sm font-extrabold">Raise a Ticket</Text>
                    <Feather name="arrow-right" size={15} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                raisedTickets.map((ticket) => (
                  <View key={ticket.id} className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
                    <View className="flex-row items-start justify-between mb-4">
                      <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
                        <Feather name="file-plus" size={20} color="#3b82f6" />
                      </View>
                      <View className="px-2.5 py-1 rounded-lg bg-blue-50">
                        <Text className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600">
                          {ticket.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-base font-extrabold text-slate-900 mb-1.5 leading-snug">
                      {ticket.title}
                    </Text>
                    <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                      {ticket.desc}
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-4">
                      <View className="px-2.5 py-1 rounded-full bg-slate-100">
                        <Text className="text-[10px] font-extrabold text-slate-600">{ticket.severity}</Text>
                      </View>
                      <View className="px-2.5 py-1 rounded-full bg-slate-100">
                        <Text className="text-[10px] font-extrabold text-slate-600">{ticket.location}</Text>
                      </View>
                    </View>
                    {ticket.images.length > 0 && (
                      <View className="flex-row gap-2 mb-4">
                        {ticket.images.slice(0, 3).map((image) => (
                          <Image
                            key={image.id}
                            source={{ uri: image.uri }}
                            style={{ width: 92, height: 92, borderRadius: 16 }}
                            contentFit="cover"
                          />
                        ))}
                      </View>
                    )}
                    <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
                      <View>
                        <Text className="text-xs font-extrabold text-slate-900 leading-none">Submitted</Text>
                        <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
                          {ticket.submittedAt}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedItem(ticket)} className="bg-slate-900 px-4 py-2.5 rounded-2xl">
                        <Text className="text-white text-xs font-extrabold">Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          <View className="bg-slate-900 rounded-3xl p-6 mt-5 mb-4 overflow-hidden">
            <Text className="text-xl font-extrabold text-white mb-2">Why your vote matters?</Text>
            <Text className="text-sm text-slate-400 font-medium leading-relaxed mb-5">
              Every supported claim strengthens the collective intelligence. Your validation mathematically triggers automated risk mitigation payouts for the entire driver network.
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {["#475569", "#10b981", "#3b82f6"].map((c, i) => (
                  <View key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 -ml-2 first:ml-0 items-center justify-center" style={{ backgroundColor: c }}>
                    {i === 2 && <Text className="text-[10px] font-extrabold text-white">+</Text>}
                  </View>
                ))}
              </View>
              <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                2,401 nodes active
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 border border-slate-100 mb-4">
            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Network Authority
            </Text>
            <Text className="text-5xl font-extrabold text-slate-900 mb-1">
              84<Text className="text-2xl text-slate-400">%</Text>
            </Text>
            <Text className="text-sm font-bold text-slate-500 mb-4">Reliability Score</Text>
            <View className="flex-row items-center gap-2 bg-emerald-50 border border-emerald-100 self-start px-3 py-1.5 rounded-lg">
              <Feather name="check-circle" size={13} color="#10b981" />
              <Text className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">
                Top Validator
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={Boolean(selectedItem)} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
            <View className="flex-1 pr-3">
              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                Complete Details
              </Text>
              <Text className="text-lg font-extrabold text-slate-900" numberOfLines={1}>
                {selectedItem?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedItem(null)} className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="x" size={16} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
            {selectedItem && (
              <>
                <View className="bg-white rounded-3xl overflow-hidden border border-slate-100 mb-4">
                  <Image
                    source={"submittedAt" in selectedItem ? (selectedItem.images[0]?.uri ? { uri: selectedItem.images[0].uri } : require("../../assets/images/icon.png")) : selectedItem.image}
                    style={{ width: "100%", height: 220 }}
                    contentFit="cover"
                  />
                </View>

                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-white rounded-3xl p-4 border border-slate-100">
                    <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Severity
                    </Text>
                    <Text className="text-sm font-bold text-slate-900">{selectedItem.severity}</Text>
                  </View>
                  <View className="flex-1 bg-white rounded-3xl p-4 border border-slate-100">
                    <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Location
                    </Text>
                    <Text className="text-sm font-bold text-slate-900">{selectedItem.location}</Text>
                  </View>
                </View>

                <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-4">
                  <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    Details
                  </Text>
                  <Text className="text-sm text-slate-600 font-medium leading-6">
                    {"details" in selectedItem ? selectedItem.details : selectedItem.desc}
                  </Text>
                </View>

                <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-4">
                  <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                    Uploaded Images
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {detailImages.length > 0 ? (
                      detailImages.map((imageUri, index) => (
                        <Image
                          key={`${String(imageUri)}-${index}`}
                          source={imageUri}
                          style={{ width: 96, height: 96, borderRadius: 16 }}
                          contentFit="cover"
                        />
                      ))
                    ) : (
                      <Text className="text-sm text-slate-500 font-medium">No images attached.</Text>
                    )}
                  </View>
                </View>

                {"submittedAt" in selectedItem && (
                  <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-4">
                    <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Submitted At
                    </Text>
                    <Text className="text-sm font-bold text-slate-900 leading-6">{selectedItem.submittedAt}</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={isRaising} animationType="slide" transparent presentationStyle="overFullScreen">
        <View className="flex-1 bg-slate-900/40 justify-end">
          <Pressable onPress={() => setIsRaising(false)} className="absolute inset-0" />
          <View className="bg-white rounded-t-[2rem] p-6 pb-10 max-h-[92%] border-t border-slate-100">
            <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-5" />
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xl font-extrabold text-slate-900">Raise Risk Ticket</Text>
              <TouchableOpacity onPress={() => setIsRaising(false)} className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center">
                <Feather name="x" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-slate-500 font-medium mb-6">
              Submit disruptive events for community validation.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Event Title
              </Text>
              <TextInput
                value={form.title}
                onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
                placeholder="e.g. Major Highway Blocked"
                placeholderTextColor="#94a3b8"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 mb-4"
              />

              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Severity / Impact
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-2xl mb-4 overflow-hidden">
                {[
                  "High Risk (Immediate payouts)",
                  "Medium Risk (Algorithmic routing)",
                  "Low Risk (Observation)",
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setForm((current) => ({ ...current, severity: option }))}
                    className={`px-4 py-3.5 border-b border-slate-200 last:border-b-0 ${form.severity === option ? "bg-blue-50" : "bg-transparent"}`}
                  >
                    <Text className={`text-sm font-semibold ${form.severity === option ? "text-blue-700" : "text-slate-700"}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Evidence / Description
              </Text>
              <TextInput
                value={form.description}
                onChangeText={(value) => setForm((current) => ({ ...current, description: value }))}
                placeholder="Describe the conditions..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 mb-4"
                style={{ textAlignVertical: "top" }}
              />

              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Location
              </Text>
              <TextInput
                value={form.location}
                onChangeText={(value) => setForm((current) => ({ ...current, location: value }))}
                placeholder="e.g. Lower East Side, Manhattan"
                placeholderTextColor="#94a3b8"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 mb-4"
              />

              <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Upload Images
              </Text>
              <TouchableOpacity
                onPress={pickImages}
                className="w-full px-4 py-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-2xl items-center mb-4"
              >
                <Text className="text-sm font-extrabold text-slate-700">Add multiple image attachments</Text>
              </TouchableOpacity>

              {form.images.length > 0 && (
                <View className="flex-row flex-wrap gap-3 mb-6">
                  {form.images.map((image) => (
                    <Image
                      key={image.id}
                      source={{ uri: image.uri }}
                      style={{ width: 84, height: 84, borderRadius: 16 }}
                      contentFit="cover"
                    />
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={submitTicket}
                className="w-full bg-blue-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-extrabold text-sm">Broadcast to Network</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
