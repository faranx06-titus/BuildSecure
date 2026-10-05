from time import time


MAX_ATTEMPTS = 5
WINDOW_SECONDS = 60

login_attempts = {}


def check_login_rate_limit(key: str):
    now = time()

    attempts = login_attempts.get(key, [])

    # Keep only attempts from the current window
    attempts = [
        timestamp
        for timestamp in attempts
        if now - timestamp < WINDOW_SECONDS
    ]

    if len(attempts) >= MAX_ATTEMPTS:
        return False

    attempts.append(now)
    login_attempts[key] = attempts

    return True