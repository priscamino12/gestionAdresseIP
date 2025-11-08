# ipmanager/network_scanner.py
import subprocess
import ipaddress
from concurrent.futures import ThreadPoolExecutor, as_completed

def ping_ip(ip: str, timeout_ms: int = 800) -> bool:
    """Retourne True si l'IP répond au ping."""
    try:
        result = subprocess.run(
            ["ping", "-c", "1", "-W", str(max(1, int(timeout_ms / 1000))), str(ip)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return result.returncode == 0
    except Exception:
        return False

def scan_network(network="192.168.1.0/24", timeout_ms=800, max_workers=50):
    """
    Retourne la liste des IPs actives dans le CIDR donné.
    Utilise un ThreadPoolExecutor pour accélérer le scan.
    """
    net = ipaddress.IPv4Network(network, strict=False)
    ips = list(net.hosts())
    active_ips = []

    # ThreadPool pour pinger plusieurs IPs en parallèle
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_ip = {executor.submit(ping_ip, str(ip), timeout_ms): ip for ip in ips}

        for future in as_completed(future_to_ip):
            ip = future_to_ip[future]
            if future.result():
                active_ips.append(str(ip))

    return active_ips
