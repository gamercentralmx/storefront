export interface AvailablePlan {
  count: number;
  interval: string;
  type: string;
}

export interface PaymentIntent {
  intent_id: string;
  available_plans: AvailablePlan[];
}
