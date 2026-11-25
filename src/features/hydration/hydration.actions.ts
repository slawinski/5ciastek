'use server';
import { hydrationSchema } from "./hydration";
import { calculateHydration } from "./hydration.utils";

export async function calculateHydrationServer({ data: input }: { data: { flourWeight: number; desiredHydration: number } }) {
    const data = hydrationSchema.parse(input);
    const { flourWeight, desiredHydration } = data;
    return calculateHydration(flourWeight, desiredHydration);
}
