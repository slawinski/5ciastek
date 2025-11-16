
import numpy as np

# Define the exponential decay function
def exp_decay(x, a, b, c):
    return a * np.exp(-b * x) + c

# Temperature to calculate for
temp_c = 23

# Parameters from the previous curve fit
params = {
    'doubling_time': {'a': 201.8390, 'b': 0.1874, 'c': 2.2057},
    'bulk_fermentation_time': {'a': 169.5076, 'b': 0.1872, 'c': 1.8512},
    'proofing_time': {'a': 124.6544, 'b': 0.1873, 'c': 1.3640},
    'mix_to_bake_time': {'a': 294.3115, 'b': 0.1873, 'c': 3.2132}
}

print(f"Calculated Times for {temp_c}°C:")
print("-" * 30)

# Calculate and print the time for each category
for name, p in params.items():
    time = exp_decay(temp_c, p['a'], p['b'], p['c'])
    # Format to hours and minutes
    hours = int(time)
    minutes = int((time * 60) % 60)
    formatted_name = name.replace('_', ' ').title()
    print(f"{formatted_name}: {time:.2f} hours ({hours}h {minutes}m)")
