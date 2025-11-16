
import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
import matplotlib.pyplot as plt

# Define the exponential decay function
def exp_decay(x, a, b, c):
    return a * np.exp(-b * x) + c

try:
    # Load and prepare the data
    df = pd.read_csv('/Users/psla/private-space/5ciastek/temp-time.csv', decimal=',')
    df.columns = df.columns.str.strip().str.replace(' ', '_')
    x_data = df['temp_C']
    time_columns = ['doubling_time', 'bulk_fermentation_time', 'proofing_time', 'mix_to_bake_time']

    # Create a 2x2 subplot grid
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Alignment of Data Points with Calculated Exponential Curves', fontsize=16)
    
    # Flatten the axes array for easy iteration
    axes = axes.flatten()

    # Fit and plot for each time column
    for i, col in enumerate(time_columns):
        y_data = df[col]
        
        # Perform the curve fit
        popt, pcov = curve_fit(exp_decay, x_data, y_data, p0=(100, 0.1, 1), maxfev=5000)
        
        # Generate x-values for the smooth curve
        plt_x_data = np.linspace(x_data.min(), x_data.max(), 100)
        
        # Plot original data points
        axes[i].scatter(x_data, y_data, label='Original Data Points', color='red', zorder=5)
        
        # Plot the fitted curve
        axes[i].plot(plt_x_data, exp_decay(plt_x_data, *popt), label='Fitted Curve', color='blue')
        
        # Set titles and labels for each subplot
        axes[i].set_title(col.replace('_', ' ').title())
        axes[i].set_xlabel('Temperature (°C)')
        axes[i].set_ylabel('Time (hours)')
        axes[i].legend()
        axes[i].grid(True)

    # Adjust layout and save the figure
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig('/Users/psla/private-space/5ciastek/detailed_curve_fits.png')

    print("Detailed plot saved to /Users/psla/private-space/5ciastek/detailed_curve_fits.png")

except FileNotFoundError:
    print("Error: temp-time.csv not found.")
except Exception as e:
    print(f"An error occurred: {e}")
