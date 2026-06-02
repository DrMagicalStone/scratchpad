## About Backend

后端的功能在于代数表达式的创建、变换和求解。

对于后端程序而言，“表达式”即为对 SymPy 表达式的简单包装。
表达式为不可变对象，表示在代数变换过程中的一个特定状态。
每个表达式除了包含其所包装的 SymPy 表达式，还包含 ID，定义的方法，parents 表达式的 ID
ID 为一个字符串，用于标识和查找一个特定的表达式，全局不重复，在此 demo 中只保证同一个服务器进程中表达式 ID 不重复
定义的方法表示表达式以何种方式（手动输入、因式分解、展开、约分等）被定义。
某些（因式分解、展开、约分等）定义方法基于现有表达式，新表达式由现有表达式变换而来，新表达式所基于的现有表达式为 parent 表达式。

例如：

初始用户手动输入得到 A: ((x - 2) ** 2) - 16 = 0，无 parents 表达式
用户应用展开（expand）变换得到 B: (x ** 2) - 4 * x - 12 = 0，有一个 parent，ID 为 "A"
用户应用因式分解（factor）变换得到 C: (x - 6) * (x + 2) = 0，有一个 parent，ID 为 "B"
用户应用求解（solve）得到 D: x = 6 or x = -2，有一个 parent，ID 为 "C"

表达式可以被序列化为 JSON 传输到前端，JSON 中包含 ID，定义方法，parents 表达式的 ID 数组，转换为 latex 的 SymPy 表达式，但是不能直接从 JSON 反序列化，定义表达式只能依靠有限的定义方法。
每种不同的定义方法被定义为表达式 Expression 类的一个实例。

## Initialization

```bash
# 安装依赖
.\init.ps1
# 如果你的电脑没有安装 Nodejs，则执行下面这行代码在项目本地安装 Nodejs
.\install_nodejs_local.ps1
# 初始化前端开发环境
cd .\src\frontend\
.\init.ps1
```

## Run

```bash
# 打开新的终端，前往 src 并运行
run_backend.ps1
# 打开新的终端，前往 src\frontend 并运行
run_frontend.ps1
```