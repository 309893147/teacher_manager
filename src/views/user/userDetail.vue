<template>
  <el-row>
    <el-row v-if="user">
      <el-col class="v-padding">{{user.userName}}</el-col>
    </el-row>
    <el-tabs v-model="activeName" v-if="user">
      <el-tab-pane name="basic" label="基本信息">
        <div class="v-padding">
          头像：
          <span>
            <img v-bind:src="user.url" alt style="height:10%;width:10%" />
          </span>
        </div>
        <div class="v-padding">用户名：{{user.userName}}</div>
        <div class="v-padding">电话：{{user.phone}}</div>
        <div class="v-padding">邮箱：{{user.email}}</div>
        <div class="v-padding">微信名：{{user.wxName}}</div>
        <div class="v-padding">性别：{{user.sex}}</div>
        <div class="v-padding">是否身份证认证：{{user.cardCertification}}</div>
        <div class="v-padding">是否高级认证：{{user.advancedCertification}}</div>
        <div class="v-padding">是否绑定银行卡：{{user.bankCardType}}</div>
        <div class="v-padding">是否填写收件地址:{{user.hasAddress}}</div>
        <div class="v-padding">积分:{{user.integral}}</div>
      </el-tab-pane>

      <el-tab-pane name="idCard" label="身份证信息">
        <div class="v-padding">姓名：{{idCard.name}}</div>
        <div class="v-padding">身份证号：{{idCard.cardNumber}}</div>
      </el-tab-pane>

       <el-tab-pane name="bankCard" label="银行卡信息">
        <UserBankCard :userId="userId"></UserBankCard>
      </el-tab-pane>

      <el-tab-pane name="address" label="地址信息">
        <UserAddress :userId="userId"></UserAddress>
      </el-tab-pane>

     

      <!-- <el-tab-pane name="overview" label="数据">
        <el-row>
          <el-col>
            <el-row v-if="data.order">
              <el-col :lg="4" :md="12" class="h-padding">
                <el-card shadow="hover">
                  <div>订单</div>
                  <div>
                    <div>
                      总计
                      <span class="number" style>{{data.order.total}}</span>
                    </div>
                    <div>
                      今日新增
                      <span class="number">{{data.order.today}}</span>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="order" label="订单">
        <el-tabs v-model="activeOrderTab" v-if="store && store.info">
          <el-tab-pane name="all" label="全部">
            <OrderList filterProperty="store" :filterId="storeId"></OrderList>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>-->
    </el-tabs>
  </el-row>
</template>
<script>
import { getArea } from "@/utils/area";
import OrderList from "@/views/order/list";
import UserAddress from "@/views/user/userAddress";
import UserBankCard from "@/views/user/userBankCard";

import qs from "qs";
export default {
  components: {
    OrderList,
    UserAddress,
    UserBankCard
  },
  data() {
    return {
      feeMethod: { feeMethod: null, feePercent: null },
      userId: null,
      showFeeSetting: false,
      store: {},
      idCard: {},
      user: {},
      activeName: "basic",
      cities: [],
      infoSettings: {},
      data: {},
      activeOrderTab: "all"
    };
  },
  created() {
    this.userId = this.$route.query.id;
    this.getUserDetail();
    this.getIdCardDetail();
  },
  methods: {
    // saveFeemethod() {
    //   let vm = this;
    //   this.startLoading();
    //   this.ax
    //     .post("store/" + this.storeId + "/setting", this.infoSettings)
    //     .then(it => {
    //       vm.stopLoading();
    //       vm.success("设置成功");
    //       vm.onStore(it);
    //     })
    //     .catch(e => {
    //       vm.stopLoading();
    //     });
    // },

    onUser(it) {
      let sex = {
        0: "男",
        1: "女"
      };

      let cardCertification = {
        0: "未认证",
        1: "认证"
      };

      let advancedCertification = {
        0: "未认证",
        1: "认证中",
        2: "认证通过"
      };

      let bankCardType = {
        0: "未绑定",
        1: "绑定"
      };

      let hasAddress = {
        0: "没有",
        1: "有"
      };

      it.sex = sex[it.sex];
      it.cardCertification = cardCertification[it.cardCertification];
      it.advancedCertification =
        advancedCertification[it.advancedCertification];
      it.bankCardType = bankCardType[it.bankCardType];
      it.hasAddress = hasAddress[it.hasAddress];
      // it.sex = sex[it.sex];
      this.user = it;
      // this.$forceUpdate();
    },

    getUserDetail() {
      let vm = this;
      this.ax
        .get("/user/detail/" + this.userId)
        .then(it => {
          console.log(it);

          vm.onUser(it);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getIdCardDetail() {
      let vm = this;
      this.ax
        .get("/user/idCard/detail/" + this.userId)
        .then(it => {
          this.idCard = it;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.v-padding {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
.h-padding {
  padding-left: 0.6rem;
  padding-right: 0.6rem;
}
.el-input {
  width: auto;
}
</style>


