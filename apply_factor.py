
# Times for 75% hydration at 23°C
times_at_75_hydration = {
    'Doubling Time': 4.92,
    'Bulk Fermentation Time': 4.14,
    'Proofing Time': 3.04,
    'Mix To Bake Time': 7.18
}

# Factor to apply
factor = 1.0

print(f"Applying a factor of {factor} to the 75% hydration times.")
print("-" * 45)

# Calculate and print the new times
for name, time in times_at_75_hydration.items():
    new_time = time * factor
    hours = int(new_time)
    minutes = int((new_time * 60) % 60)
    print(f"{name}: {new_time:.2f} hours ({hours}h {minutes}m)")
