
# Original times calculated for 23°C at 75% hydration
times_at_75_hydration = {
    'Doubling Time': 4.92,
    'Bulk Fermentation Time': 4.14,
    'Proofing Time': 3.04,
    'Mix To Bake Time': 7.18
}

# Hydration levels
old_hydration = 75.0
new_hydration = 80.0

# Calculate the adjustment factor
adjustment_factor = old_hydration / new_hydration

print(f"Calculating times for {new_hydration}% hydration based on a {old_hydration}% hydration baseline.")
print(f"Adjustment Factor: {adjustment_factor:.4f}")
print("-" * 40)

# Calculate and print the new times
for name, time in times_at_75_hydration.items():
    new_time = time * adjustment_factor
    hours = int(new_time)
    minutes = int((new_time * 60) % 60)
    print(f"{name}: {new_time:.2f} hours ({hours}h {minutes}m)")
