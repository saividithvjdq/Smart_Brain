"""
Rate Limiter — Simple in-memory rate limiting.

📚 LEARNING:
    Rate limiting prevents abuse by limiting how many requests
    an IP address can make within a time window.

    This is an in-memory implementation (resets on server restart).
    For production, use Redis-backed rate limiting (see optimization plan).
"""

import time
from collections import defaultdict

# Config
MAX_REQUESTS = 10        # max requests per window
WINDOW_SECONDS = 60      # time window in seconds

# Store: IP → list of request timestamps
_request_log: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(ip: str) -> bool:
    """
    Check if a request from this IP is allowed.
    Returns True if allowed, False if rate limited.

    📚 LEARNING:
        Sliding window algorithm:
        1. Remove all timestamps older than WINDOW_SECONDS
        2. Count remaining timestamps
        3. If count >= MAX_REQUESTS, block the request
        4. Otherwise, add current timestamp and allow
    """
    now = time.time()
    cutoff = now - WINDOW_SECONDS

    # Remove expired entries
    _request_log[ip] = [t for t in _request_log[ip] if t > cutoff]

    # Check limit
    if len(_request_log[ip]) >= MAX_REQUESTS:
        return False

    # Record this request
    _request_log[ip].append(now)
    return True
