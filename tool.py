import math
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('Agg')
import io
import base64

class DataTool:
    def __init__(self, values, frequencies):
        self.val = values
        self.freq = frequencies
        self.dataset = self._create_dataset()
        self.n_sample = len(self.dataset)
        
    def _create_dataset(self):
        return sorted([val for val, freq in zip(self.val, self.freq) for _ in range(freq)])
        
    def cal_mean(self):
        weighted_sum = sum(self.dataset)
        mean = weighted_sum / self.n_sample if self.n_sample > 0 else 0
        return mean
    
    def cal_median(self):
        n = self.n_sample
        mid = n // 2
        if n % 2 == 0:
            return (self.dataset[mid - 1] + self.dataset[mid]) / 2
        return self.dataset[mid]
        
    def cal_mode(self):
        max_feq = max(self.freq)
        return [value for value, freq in zip(self.val, self.freq) if freq == max_feq]
        
    def cal_midrange(self):
        return 1/2*(self.dataset[0]+self.dataset[-1])
    
    def cal_quartiles(self):
        n = len(self.dataset)
        
        index1 = (n + 1) / 4 - 1
        Q1 = self.get_value(index1)
        
        index2 = (n + 1) / 2 - 1
        Q2 = self.get_value(index2)
        
        index3 = 3 * (n + 1) / 4 - 1
        Q3 = self.get_value(index3)
        
        IQR = Q3 - Q1
        
        return Q1, Q2, Q3, IQR

    def cal_variance(self):
        mean = self.cal_mean()
        squared_diffs = [(x - mean) ** 2 for x in self.dataset]
        return sum(squared_diffs) / self.n_sample if self.n_sample > 0 else 0
    
    def get_value(self, index):
        lower = math.floor(index)
        upper = math.ceil(index)
        if lower == upper or upper >= self.n_sample:
            return self.dataset[lower]
        return (self.dataset[lower] + self.dataset[upper]) / 2
        
    def boxplot(self):
        Q1, Q2, Q3, IQR = self.cal_quartiles()
        
        # Plotting
        plt.figure(figsize=(8, 6))
        plt.boxplot(self.dataset, vert=False, patch_artist=True, 
                    medianprops=dict(color='red', linewidth=3),
                    boxprops=dict(facecolor='lightblue', color='black'),
                    whiskerprops=dict(color='blue'),
                    capprops=dict(color='black'),
                    flierprops=dict(marker='o', color='red', alpha=1))
        
        plt.title('Boxplot')
        plt.xlabel('Values')
        plt.grid(True)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        # Clear the plot so future plots are not affected
        buf.close()
        plt.clf()

        return img_base64