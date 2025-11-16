
import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
import matplotlib.pyplot as plt

# Define the exponential decay function to fit
def exp_decay(x, a, b, c):
    return a * np.exp(-b * x) + c

# Load the data
try:
    # Load the CSV, converting comma decimals to periods
    df = pd.read_csv('/Users/psla/private-space/5ciastek/temp-time.csv', decimal=',')

    # Clean up column names
    df.columns = df.columns.str.strip().str.replace(' ', '_')

    # Extract the data
    x_data = df['temp_C']
    time_columns = ['doubling_time', 'bulk_fermentation_time', 'proofing_time', 'mix_to_bake_time']

    # Create a plot
    plt.figure(figsize=(12, 8))
    plt.scatter(x_data, df[time_columns[0]], label='Doubling Time Data', marker='o')
    plt.scatter(x_data, df[time_columns[1]], label='Bulk Fermentation Time Data', marker='x')
    plt.scatter(x_data, df[time_columns[2]], label='Proofing Time Data', marker='s')
    plt_x_data = np.linspace(x_data.min(), x_data.max(), 100)

    print("Exponential Curve Fit Results (y = a * exp(-b * x) + c):")
    print("-" * 60)

    # Fit and plot for each time column
    for col in time_columns:
        y_data = df[col]
        
        # Perform the curve fit
        popt, pcov = curve_fit(exp_decay, x_data, y_data, p0=(100, 0.1, 1), maxfev=5000)
        
        # Print the results
        a, b, c = popt
        print(f"Parameters for '{col}':")
        print(f"  a = {a:.4f}")
        print(f"  b = {b:.4f}")
        print(f"  c = {c:.4f}\n")

        # Plot the fitted curve
        plt.plot(plt_x_data, exp_decay(plt_x_data, *popt), label=f'{col.replace("_", " ").title()} Fit')

    # Finalize the plot
    plt.title('Exponential Curve Fit of Fermentation Times vs. Temperature')
    plt.xlabel('Temperature (°C)')
    plt.ylabel('Time (hours)')
    plt.legend()
    plt.grid(True)
    plt.savefig('/Users/psla/private-space/5ciastek/temperature_curve_fit.png')

    print("Plot saved to /Users/psla/private-space/5ciastek/temperature_curve_fit.png")

except FileNotFoundError:
    print("Error: temp-time.csv not found.")
except Exception as e:
    print(f"An error occurred: {e}")
