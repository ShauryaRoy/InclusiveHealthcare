import { useState } from "react";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShoppingCart, CreditCard, Package, Truck } from "lucide-react";

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  shippingAddress: z.string().min(10, "Please enter a complete address"),
  deliveryInstructions: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  prescription: boolean;
  brand: string;
  dosage: string;
}

interface PharmacyCheckoutFormProps {
  cart: CartItem[];
  clientSecret: string;
  orderNumber: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PharmacyCheckoutForm({ 
  cart, 
  clientSecret, 
  orderNumber, 
  onSuccess, 
  onError 
}: PharmacyCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      deliveryInstructions: "",
    },
  });

  const handleSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      onError("Payment system not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pharmacy?order=${orderNumber}`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
        return;
      }

      // If payment successful, update order in backend
      await apiRequest("POST", "/api/pharmacy/complete-order", {
        orderNumber,
        customerInfo: data,
        cart,
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been confirmed. You'll receive email updates.`,
      });

      onSuccess();
    } catch (error) {
      onError("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Summary - {orderNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.brand} • {item.dosage}</p>
                  {item.prescription && (
                    <p className="text-xs text-orange-600">⚠️ Prescription Required</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="your@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="(555) 123-4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Enter your complete address including street, city, state, and ZIP code"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Special delivery instructions, preferred delivery time, etc."
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Element */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentElement />
                </CardContent>
              </Card>

              <div className="flex items-center gap-4 pt-4">
                <Truck className="w-5 h-5 text-green-600" />
                <div className="text-sm text-gray-600">
                  <p>Free delivery on orders over $35</p>
                  <p>Estimated delivery: 2-3 business days</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)} & Place Order`}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By placing this order, you agree to our terms of service and privacy policy.
                Prescription medications require pharmacist verification before shipping.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

interface PharmacyCheckoutProps {
  cart: CartItem[];
  onSuccess?: () => void;
}

export default function PharmacyCheckout({ cart, onSuccess }: PharmacyCheckoutProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientSecret, setClientSecret] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create payment intent and order
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const response = await apiRequest("POST", "/api/pharmacy/create-order", {
        cart,
        customerInfo: data,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setOrderNumber(data.orderNumber);
      queryClient.invalidateQueries({ queryKey: ["/api/pharmacy/orders"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  const handleSuccess = () => {
    setClientSecret("");
    setOrderNumber("");
    if (onSuccess) onSuccess();
  };

  const handleError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some medicines to your cart to proceed with checkout.</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Complete Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Show cart preview */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.brand} • Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>

              <Button 
                onClick={() => createOrderMutation.mutate({
                  customerName: "",
                  customerEmail: "",
                  customerPhone: "",
                  shippingAddress: "",
                  deliveryInstructions: "",
                })}
                disabled={createOrderMutation.isPending}
                className="w-full"
                size="lg"
              >
                {createOrderMutation.isPending ? "Creating Order..." : "Proceed to Payment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }}
      >
        <PharmacyCheckoutForm
          cart={cart}
          clientSecret={clientSecret}
          orderNumber={orderNumber}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Elements>
    </div>
  );
}