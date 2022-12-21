## Requirements
> Target: Light-weight, Modern UI, Components Extensible, 

**User System**: Clinical User, Client User can Sign up and login

**Form Editor**: Clinical Users can generate a survey by selecting different components.

**Survey Distribution**: Clinical User指定Client和自己的Survey生成一个Survey链接，只要问卷被填写，result被记录到数据库中并关联该Clinical和Client.

**Web Accessibility**: 所有元素都要被Tab可以依次选中，拖拽的元素必须要可以右键打开一个menu代替拖拽操作。
所有表单操作必须可以用Tab和Enter(确认)来完成

## 组件
表单基本组件: 单选、多选、Input输入框、Textarea文本框
### 高级组件
#### 拖拽分类组件
可以将若干个卡片拖进不同的分类盒子中

#### 优先级设置组件
可以将不同的选项卡片（来自不同分类）排列


## 生成Survey Link
Survey Url包含问卷信息和填写问卷的客户账户信息, 客户无需登录，填写完问卷，根据Survey Url匹配客户账户信息。

## Report
Clinical Report

User Report

Download as PDF




## SuperAdmin(low priority)
可以接入第三方Matrix和Monitor(pm2 monitor)服务

登录看到有多少clinical user使用我们的平台, 各个Clinical user问卷的内容，以及result填写结果和情况