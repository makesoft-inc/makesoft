# GitHub Actions Self-Hosted Runner Setup

This guide explains how to set up a GitHub Actions self-hosted runner on your server for automated deployments.

## Why Self-Hosted Runner?

Using a self-hosted runner eliminates the need for SSH connections from GitHub Actions to your server, avoiding network connectivity issues and firewall complications.

## Prerequisites

- Ubuntu server (20.04+)
- Docker and Docker Compose installed
- Git installed
- User with sudo access

## Setup Instructions

### 1. Create Runner Directory

```bash
mkdir actions-runner && cd actions-runner
```

### 2. Download the Latest Runner Package

```bash
# Download the latest runner (check https://github.com/actions/runner/releases for latest version)
curl -o actions-runner-linux-x64-2.329.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.329.0/actions-runner-linux-x64-2.329.0.tar.gz
```

### 3. Validate the Hash (Optional but Recommended)

```bash
echo "194f1e1e4bd02f80b7e9633fc546084d8d4e19f3928a324d512ea53430102e1d  actions-runner-linux-x64-2.329.0.tar.gz" | shasum -a 256 -c
```

### 4. Extract the Installer

```bash
tar xzf ./actions-runner-linux-x64-2.329.0.tar.gz
```

### 5. Configure the Runner

Get a registration token from GitHub:
1. Go to your repository: `https://github.com/makesoft-inc/makesoft`
2. Settings → Actions → Runners → New self-hosted runner
3. Copy the registration token (expires in 1 hour)

Run the configuration:

```bash
./config.sh --url https://github.com/makesoft-inc/makesoft --token YOUR_REGISTRATION_TOKEN
```

You'll be prompted for:
- Runner name (default: server hostname)
- Labels (optional, press Enter for defaults)
- Work folder (default: `_work`)

### 6. Install as a Service (Recommended)

This ensures the runner starts automatically on boot:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

To check status:
```bash
sudo ./svc.sh status
```

### 7. Verify Runner is Online

1. Go to: `https://github.com/makesoft-inc/makesoft/settings/actions/runners`
2. You should see your runner listed as "Idle" (green)

## Manual Runner (Alternative)

If you prefer not to install as a service, you can run it manually:

```bash
./run.sh
```

Note: This will stop when you close the terminal. Use `screen` or `tmux` to keep it running.

## Troubleshooting

### Runner Not Appearing in GitHub

1. Check if the runner process is running:
   ```bash
   ps aux | grep Runner.Listener
   ```

2. Check logs:
   ```bash
   cd actions-runner
   cat _diag/Runner_*.log
   ```

3. Verify configuration:
   ```bash
   cat .runner
   ```

### Runner Service Not Starting

```bash
# Check service status
sudo ./svc.sh status

# View service logs
sudo journalctl -u actions.runner.makesoft-inc-makesoft.* -f

# Restart service
sudo ./svc.sh restart
```

### Runner Not Picking Up Jobs

1. Ensure runner is online in GitHub UI
2. Check that workflow uses `runs-on: self-hosted`
3. Verify runner has necessary permissions (Docker, git, etc.)

### Permission Issues

If you get permission errors when running Docker commands:

```bash
# Add runner user to docker group (if using a different user)
sudo usermod -aG docker $USER
newgrp docker
```

## Updating the Runner

When a new version is available:

```bash
cd actions-runner

# Stop the service
sudo ./svc.sh stop

# Download latest version
./run.sh --update

# Restart the service
sudo ./svc.sh start
```

## Removing the Runner

To remove the runner:

```bash
cd actions-runner

# Stop and uninstall service
sudo ./svc.sh stop
sudo ./svc.sh uninstall

# Remove runner from GitHub (via UI or API)
./config.sh remove --token YOUR_REMOVAL_TOKEN
```

## Security Considerations

- The runner has full access to your server
- Ensure the runner user has minimal necessary permissions
- Consider running the runner in a restricted user account
- Regularly update the runner software
- Monitor runner logs for suspicious activity

## Multiple Runners

You can set up multiple runners for load balancing:

1. Create separate directories for each runner:
   ```bash
   mkdir actions-runner-1 actions-runner-2
   ```

2. Configure each with different labels:
   ```bash
   ./config.sh --url https://github.com/makesoft-inc/makesoft --token TOKEN --labels production,server1
   ```

3. Update workflow to use specific labels:
   ```yaml
   runs-on: [self-hosted, production]
   ```

## References

- [GitHub Actions Self-Hosted Runners Documentation](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Runner Releases](https://github.com/actions/runner/releases)

