from datetime import timedelta

def calculate_streak(dates):
    if not dates:
        return 0
    streak = 1
    for i in range(1, len(dates)):
        if (dates[i - 1] - dates[i]) == timedelta(days=1):
            streak += 1
        else:
            break
    return streak
