import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Heart, CreditCard, Shield, CheckCircle } from "lucide-react";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const donationFormSchema = z.object({
  amount: z.number().min(5, "Minimum donation is $5"),
  program: z.string().optional(),
  donorName: z.string().min(2, "Name must be at least 2 characters"),
  donorEmail: z.string().email("Please enter a valid email address"),
  isRecurring: z.boolean().default(false),
});

type DonationFormData = z.infer<typeof donationFormSchema>;

function DonationCheckoutForm({ 
  donationData, 
  clientSecret, 
  onSuccess 
}: { 
  donationData: DonationFormData;
  clientSecret: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate?success=true`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Donation Successful!",
          description: "Thank you for supporting inclusive healthcare.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Secure Donation - ${donationData.amount}
        </h3>
        <p className="text-sm text-green-700">
          Your donation supports inclusive healthcare for underserved communities. 
          All donations are tax-deductible.
        </p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Donation...
          </div>
        ) : (
          <>
            <Heart className="w-5 h-5 mr-2" />
            Donate ${donationData.amount}
          </>
        )}
      </Button>
    </form>
  );
}

interface DonationFormProps {
  initialAmount?: number;
  initialProgram?: string;
  onSuccess?: () => void;
}

export default function DonationForm({ 
  initialAmount = 25, 
  initialProgram = "", 
  onSuccess 
}: DonationFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "success">("form");
  const [clientSecret, setClientSecret] = useState("");
  const [donationData, setDonationData] = useState<DonationFormData | null>(null);

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: initialAmount,
      program: initialProgram || "general",
      donorName: "",
      donorEmail: "",
      isRecurring: false,
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: DonationFormData) => {
      const response = await apiRequest("POST", "/api/create-donation-intent", {
        amount: data.amount,
        program: data.program,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setCurrentStep("payment");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation setup.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationFormData) => {
    setDonationData(data);
    paymentMutation.mutate(data);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep("success");
    form.reset();
    if (onSuccess) onSuccess();
  };

  if (currentStep === "success") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Your Donation!
            </h2>
            <p className="text-gray-600 mb-6">
              Your generous contribution of ${donationData?.amount} will directly impact 
              patients in need of inclusive healthcare services.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">What Happens Next?</h3>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Tax receipt will be emailed to you within 24 hours</li>
                <li>• Your donation goes directly to program funding</li>
                <li>• You'll receive updates on how your gift is making a difference</li>
                <li>• Contact us anytime for donation questions</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep("form")}
                className="mr-4"
              >
                Make Another Donation
              </Button>
              <Button variant="outline" asChild>
                <a href="/">Return to Home</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === "payment" && clientSecret && donationData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Complete Your Donation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#16a34a",
                },
              },
            }}
          >
            <DonationCheckoutForm
              donationData={donationData}
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </CardContent>
      </Card>
    );
  }

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-6 h-6 mr-2" />
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Amount</h3>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={form.watch("amount") === amount ? "default" : "outline"}
                    onClick={() => form.setValue("amount", amount)}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        step="0.01"
                        placeholder="Enter custom amount"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Program Selection */}
            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support a Specific Program (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program to support" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Fund</SelectItem>
                      <SelectItem value="accessibility">Accessibility Enhancement Fund</SelectItem>
                      <SelectItem value="multilingual">Multilingual Care Initiative</SelectItem>
                      <SelectItem value="outreach">Community Outreach Program</SelectItem>
                      <SelectItem value="mental-health">Mental Health Equity Fund</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Donor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={paymentMutation.isPending}
            >
              {paymentMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Continue to Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}