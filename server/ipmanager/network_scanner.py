import subprocess
import ipaddress

def scan_network(network="192.168.1.0/24"):
    local_net = ipaddress.IPv4Network(network, strict=False)
    active_ips = []

    for ip in local_net.hosts():
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "0.2", str(ip)],   # 200 ms au lieu de 1 sec
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        if result.returncode == 0:
            active_ips.append(str(ip))

    return active_ips
