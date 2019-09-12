<template>
  <div>
    <el-tabs>
      <el-tab-pane label="邀请积分设置">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="用户邀请好友获得积分">
                <el-input v-model="pointsItem.content" placeholder="邀请好友所得积分"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateWebPagePointsConfig()"
                  v-if="editable"
                  :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客服微信">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="微信号">
                <el-input v-model="wxItem.content" placeholder="客服人员微信号码"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateWebPageWxConfig()"
                  v-if="editable"
                  :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="客服电话">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="电话号码">
                <el-input v-model="phoneItem.content" placeholder="客服人员电话号码"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateWebPagePhoneConfig()"
                  v-if="editable"
                  :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="支付配置">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="微信分配的公众账号ID(appid)">
                <el-input v-model="currentItem.appId" placeholder="微信分配的公众账号ID"></el-input>
              </el-form-item>

              <el-form-item label="微信支付分配的商户号(mchid)">
                <el-input v-model="currentItem.mchId" placeholder="微信支付分配的商户号"></el-input>
              </el-form-item>

              <el-form-item label="商户密钥(mch_key)">
                <el-input v-model="currentItem.mchKey" placeholder="商户密钥"></el-input>
              </el-form-item>

              <el-form-item label="商品简单描述">
                <el-input v-model="currentItem.body" placeholder="付款方抬头"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="updateWxpayConfiug()" v-if="editable" :loading="loading">保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="短信配置">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="账号">
                <el-input v-model="smsItem.sname" placeholder="账号"></el-input>
              </el-form-item>

              <el-form-item label="密码">
                <el-input v-model="smsItem.spwd" placeholder="密码"></el-input>
              </el-form-item>

              <el-form-item label="标题">
                <el-input v-model="smsItem.sign" placeholder="短信标题"></el-input>
              </el-form-item>

              <el-form-item label="秒">
                <el-input v-model="smsItem.expireTime" placeholder="秒"></el-input>
              </el-form-item>

              <el-form-item label="验证码长度">
                <el-input v-model="smsItem.codeLength" placeholder="短信验证码的长度"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateSmsConfig()"
                  v-if="editable"
                  :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="新手专享">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="微信号">
                <el-input v-model="exclusive.wx" placeholder="微信号"></el-input>
              </el-form-item>

              <el-form-item label="投资金额">
                <el-input v-model="exclusive.investmentAmount" placeholder="投资金额"></el-input>
              </el-form-item>

              <el-form-item label="投资天数">
                <el-input v-model="exclusive.investmentDay" placeholder="投资天数"></el-input>
              </el-form-item>

              <el-form-item label="收益金额">
                <el-input v-model="exclusive.amountIncome" placeholder="收益金额"></el-input>
              </el-form-item>

              <el-form-item label="赠送积分">
                <el-input v-model="exclusive.giftPoints" placeholder="赠送积分"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateExclusiveData()"
                  v-if="editable"
                  :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="定金">
        <el-row>
          <el-col :span="8">
            <el-form label-position="top" label-width="80px" :disabled="!editable">
              <el-form-item label="定金">
                <el-input v-model="deposit.content" placeholder="定金"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button
                    type="primary"
                    @click="updateWebPageDepositConfig()"
                    v-if="editable"
                    :loading="loading"
                >保存</el-button>
                <el-button @click="cancelEdit" v-if="editable" :disabled="loading">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button @click="editable=true" v-if="!editable" type="primary">编辑</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>


    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      currentItem: "",
      smsItem: "",
      pointsItem: "",
      phoneItem: "",
      wxItem: "",
      deposit: '',
      editable: false,
      config: [],
      rules: {},
      loading: false,
      formModel: {},

      exclusive: ''
    };
  },
  created() {
    this.getWebPagePointsConfig();
    this.getWxPayConfig();
    this.getSmsConfig();
    this.getWebPagePhoneConfig();
    this.getWebPageWxConfig();
    this.getExclusiveData();
    this.getWebPageDepositConfig()
  },
  methods: {
    cancelEdit() {
      this.editable = false;
    },
   
    getWebPagePointsConfig() {
      let vm = this;
      vm.ax
        .get("/webpage/querybyname?name=" + "invite_points")
        .then(it => {
          JSON.parse(JSON.stringify(it)).map(res =>{
            vm.pointsItem =res
          })
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    getWebPageWxConfig() {
      let vm = this;
      vm.ax
        .get("/webpage/querybyname?name=" + "wechat_number")
        .then(it => {
          JSON.parse(JSON.stringify(it)).map(res =>{
            vm.wxItem = res;
          })
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    getWebPagePhoneConfig() {
      let vm = this;
      vm.ax
        .get("/webpage/querybyname?name=" + "my_customer_number")
        .then(it => {
          JSON.parse(JSON.stringify(it)).map(res =>{
            vm.phoneItem = res;
          })
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },

    getWebPageDepositConfig() {
      let vm = this;
      vm.ax
          .get("/webpage/querybyname?name=" + "deposit")
          .then(it => {
            JSON.parse(JSON.stringify(it)).map(res =>{
              vm.deposit = res;
            })
          })
          .catch(err => {
            console.log(err); // 这里catch到错误timeout
          });
    },

    updateWebPageDepositConfig() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/webpage/update", vm.deposit).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },

     getWxPayConfig() {
      let vm = this;
      this.ax
        .get("/common/wxpayconfig")
        .then(it => {
          vm.currentItem = JSON.parse(JSON.stringify(it));
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },
    getSmsConfig() {
      let vm = this;
      this.ax
        .get("/common/smsconfig")
        .then(it => {
          vm.smsItem = JSON.parse(JSON.stringify(it));
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        });
    },

    getExclusiveData(){
      this.ax.get('/publicproject/novice/exclusive')
          .then(res =>{
            this.exclusive = res
          })
    },
    updateExclusiveData(){
      this.ax.post('/publicproject/update/exclusive',this.exclusive)
          .then(res =>{
            this.$message.success('保存成功')
            this.editable=false
          })
    },

    updateWebPagePointsConfig() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/webpage/update", vm.pointsItem).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },
    updateWebPagePhoneConfig() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/webpage/update", vm.phoneItem).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },
    updateWebPageWxConfig() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/webpage/update", vm.wxItem).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },
   
    updateSmsConfig() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/common/updateSmsConfig", vm.smsItem).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },

     updateWxpayConfiug() {
      let vm = this;
      vm.loading = true;
      this.ax.post("/common/updateWxpayConfiug", vm.currentItem).then(it => {
        vm.loading = false;
        vm.editable = false;
        vm.$message.success({ message: "修改成功" });
      });
    },
  }
};
</script>
