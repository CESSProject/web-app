<template>
  <div class="menu" ref="menu" >
    <div v-if="kind == 'accounts'" class="accounts-title">
      <img src="../assets/icons/logo-icon.png" width="15px" />Select Account
      <img
        src="../assets/icons/close-icon2.png"
        width="22px"
        class="close-icon"
        @click="closeMenu"
      />
    </div>
    <ul class="customDropDown" ref="ul" :style="kind == 'normal'? '': 'padding-bottom:40px'" @touchmove.stop>
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="item.callback(item);
          closeMenu();
        "
      >
        <p :class="item.value ? 'flex' : ''" v-if="kind == 'normal'">
          <img :src="item.icon" width="17px" />
          <span style="margin-right: 10px">{{ item.text }}</span
          ><span>{{ item.value }}</span>
        </p>
        <div v-if="kind == 'accounts'" class="accounts-item">
          <img :src="item.icon" width="33px" />
          <div>
            <div class="accounts-name">{{ item.meta.name }}</div>
            <div class="accounts-add">{{ item.address }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import anime from "animejs";
export default {
  name: "CustomDropDown",
  components: {},
  data() {
    return {};
  },
  props: ["items", "visible", "kind", "height"],
  async created() {},
  mounted() {
    document.addEventListener("click", this.autoCloseMenu, false);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.autoCloseMenu);
  },
  watch: {
    visible(newVal) {
      this.$nextTick(() => {
        anime.remove(this.$refs.menu);
        this.$refs.menu.classList.add("visible");
        if (newVal) {
          anime({
            targets: this.$refs.menu,
            height: this.height,
            // height: [0, height * this.$refs.ul.childNodes.length + 20],
            duration: 350,
            easing: "easeOutExpo",
          });
        } else {
          this.closeMenu();
        }
      });
    },
  },
  methods: {
    closeMenu() {
      anime({
        targets: this.$refs.menu,
        height: 0,
        duration: 0,
        easing: "easeOutExpo",
        complete: () => {
          try {
            this.$refs.menu.classList.remove("visible");
          } catch (e) {
            console.log(e)
          }
          if (this.visible) {
            this.$emit("update:visible", false);
          }
        },
      });
    },
    autoCloseMenu(e) {
      function isParent(obj, parentObj) {
        // && obj.tagName.toUpperCase() !== 'BODY'
        while (obj !== undefined && obj !== null) {
          if (obj === parentObj) {
            return true;
          }
          obj = obj.parentNode;
        }
        return false;
      }
      if (!isParent(e.target, this.$refs.menu.parentNode)) {
        this.closeMenu();
        this.$refs.ul.scrollTop = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.menu {
  font-size: 14px;
  overflow: hidden;
  display: none;
  min-width: 176px;
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 20px;
  padding: 12px 12px;
  box-sizing: border-box;
  position: absolute;
  top: 65px;
  right: 0;
  z-index: 9999;
  .accounts-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #303030;
    position: relative;
    cursor: pointer;
    padding: 0 20px 16px;
    img {
      margin-right: 15px;
    }
    .close-icon {
      position: absolute;
      right: 0px;
    }
  }
  &.visible {
    display: block;
  }
  .customDropDown {
    box-sizing: border-box;
    color: #303030;
    list-style-type: none;
    width: 100%;
    margin: 0;
    padding-left: 10px;
    height: 100%;
    overflow-y: auto;


    li {
      position: relative;
      transition: 0.2s linear color;
      text-align: center;

      p {
        width: 100%;
        box-sizing: border-box;
        color: #303030;
        margin: 0;
        height: 46px;
        line-height: 46px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-top: 1px solid #d7d7d7;
        text-align: left;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          margin-right: 10px;
        }
      }

      .accounts-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: 1;
        border-top: 1px solid #d7d7d7;
        color: #303030;
        padding: 16px 20px;
        text-align: left;
        cursor: pointer;
        img {
          margin-right: 10px;
        }
        .accounts-name {
          font-size: 14px;
          word-break: break-all;
        }
        .accounts-add {
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 5px;
        }
      }
      .accounts-item:hover {
        background: #f6f7fb;
      }
    }
    li:first-child {
      p {
        border-top: none;
      }
    }
  }
}
.customDropDown {
  position: relative;
  &::-webkit-scrollbar {
    width: 2px;
    height: 10px;
    position: absolute;
    right: 20px;
    top: 50px;
  }

  /* 滑块 */
  &::-webkit-scrollbar-thumb {
    border-left: 5px solid rgba(0, 0, 0, 0.3);
    border-radius: 0px;
    width: 10px;
    position: absolute;
    right: 20px;
    top: 50px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #d7d7d7;
  }

  &::-webkit-scrollbar-track {
    width: 2px;
    margin-right: 20px;
  }
}
</style>
