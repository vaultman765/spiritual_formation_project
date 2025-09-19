import re
from django.http.request import HttpRequest
from django.core.exceptions import DisallowedHost

_original_get_host = HttpRequest.get_host


# Patch to allow AWS App Runner internal IPs (169.254.172.X)
# Django runs get_host() before middleware, so we patch it directly
def _patched_get_host(self):
    try:
        return _original_get_host(self)
    except DisallowedHost as e:
        host = self.META.get("HTTP_HOST", "").split(":")[0]
        # Allow only specific AWS App Runner internal IP range
        if re.match(r"^169\.254\.172\.([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$", host):
            return host
        raise e


HttpRequest.get_host = _patched_get_host
