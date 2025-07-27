# 6.24

## Windows 取证

- 关于如何获得序列号

```
wmic diskdrive get serialnumber
```

- 关于USB插拔的记录

通过注册表获取Windows USB设备信息及插拔记录 在Windows中，USB设备信息确实存储在注册表中，但获取完整的USB插拔历史记录需要更深入的了解。下面我将详细介绍相关机制和方法。 ## USB设备信息存储机制 Windows通过以下注册表路径存储USB设备信息：

```
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\USB
```

关键位置解析：

```
   HKLM\SYSTEM\CurrentControlSet\Enum\USB
   ├── VID_XXXX&PID_XXXX          // 设备标识符 (厂商ID和产品ID)
   │   ├── InstanceID             // 设备实例ID
   │   │   ├── Device Parameters
   │   │   ├── Properties
   │   │   └── Control            // 包含设备状态信息
```

USB挂载点：

```
   HKLM\SYSTEM\MountedDevices
```

USB历史事件

```
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\USBSTOR\Enum
```

Powershell的代码

```
# 获取所有USB设备基本信息
$devices = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\USB\*"

foreach ($device in $devices) {
    $vidpid = $device.PSChildName
    $devicePath = "HKLM:\SYSTEM\CurrentControlSet\Enum\USB\$vidpid"
    
    # 获取设备实例
    $instances = Get-ChildItem -Path $devicePath
    
    foreach ($instance in $instances) {
        $instancePath = $instance.PSPath
        $properties = Get-ItemProperty -Path $instancePath
        
        Write-Host "设备ID: $($properties.DeviceDesc)"
        Write-Host "硬件ID: $($properties.HardwareID)"
        Write-Host "制造商: $($properties.Mfg)"
        Write-Host "驱动程序: $($properties.Driver)"
        Write-Host "首次安装时间: $([DateTime]::FromFileTime($properties.InstallDate))"
        Write-Host "设备状态: $($properties.Status)"
        Write-Host "设备GUID: $($properties.ClassGUID)"
        Write-Host "---------------------------------"
    }
}

# 获取USB存储设备挂载点
$mountedDevices = Get-ItemProperty -Path "HKLM:\SYSTEM\MountedDevices"
foreach ($property in $mountedDevices.Property) {
    if ($property.StartsWith("\\??\\Volume")) {
        $driveLetter = [char]$property[12] + ":"
        $deviceId = $property.Substring(8, 48)
        Write-Host "磁盘: $driveLetter -> $deviceId"
    }
}

# 获取USB设备历史记录
$usbHistory = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\USBSTOR\Enum"
Write-Host "`nUSB存储设备历史记录:"
$usbHistory.PSObject.Properties | Where-Object {
    $_.Name -match '^\d+$'
} | ForEach-Object {
    $value = $_.Value
    $parts = $value -split '#'
    $vidpid = $parts[1]
    $serial = $parts[2]
    $firstConnect = $parts[3]
    
    Write-Host "设备: $vidpid"
    Write-Host "序列号: $serial"
    Write-Host "首次连接时间: $([DateTime]::FromFileTime($firstConnect))"
}
```

1. 密件认定

- 无线电

HDMI泄露

VGA泄露

Apple系列侦测



#  6.25

- CTF之恶意代码分析

工具包：https://down.52pojie.cn

常用工具010 HEX，IDA pro，x64dbg，snippaste





- 网络攻防基础

查IP地址归属地，DNS日志

- 木马告警分析

- 网络溯源

# 6.26 

- 网络渗透，内核提权，web提权，docker提权，crontab提权，suid提权
- 漏洞挖掘：手工挖掘，自动化扫描
- 漏洞类型：缓冲区溢出，整数溢出，逻辑漏洞
- SQL注入

AFL 软件







