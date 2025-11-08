import subprocess
import ipaddress
from concurrent.futures import ThreadPoolExecutor, as_completed

def ping_ip(ip: str, timeout_ms: int = 800):
    try:
        result = subprocess.run(
            ["ping", "-c", "1", "-W", str(max(1, int(timeout_ms / 1000))), ip],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return result.returncode == 0
    except:
        return False


def scan_network(network="192.168.1.0/24", timeout_ms=800, max_workers=50):
    net = ipaddress.IPv4Network(network, strict=False)
    ips = list(net.hosts())
    active_ips = []

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(ping_ip, str(ip), timeout_ms): ip for ip in ips}

        for future in as_completed(futures):
            ip = futures[future]
            if future.result():
                active_ips.append(str(ip))

    return active_ips
