
# Times for 80% hydration at 23°C
times_at_80_hydration = {
    'Doubling Time': 4.61,
    'Bulk Fermentation Time': 3.88,
    'Proofing Time': 2.85,
    'Mix To Bake Time': 6.73
}

# Factor to apply
factor = 0.9

print(f"Applying a factor of {factor} to the 80% hydration times.")
print("-" * 45)

# Calculate and print the new times
for name, time in times_at_80_hydration.items():
    new_time = time * factor
    hours = int(new_time)
    minutes = int((new_time * 60) % 60)
    print(f"{name}: {new_time:.2f} hours ({hours}h {minutes}m)")
