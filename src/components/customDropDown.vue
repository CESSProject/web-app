<template>
  <div class="menu" ref="menu">
    <ul class="customDropDown" ref="ul">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="
          item.callback();
          closeMenu();
        "
      >
        <p :class="item.value ? 'flex' : ''">
          <img :src="item.icon" width="17px" />
          <span style="margin-right: 10px">{{ item.text }}</span
          ><span>{{ item.value }}</span>
        </p>
        <div>
          
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
  props: ["items", "visible"],
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
            height: [0, 36 * this.$refs.ul.childNodes.length + 20],
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
          } catch (e) {}
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
  width: 176px;
  height: 158px;
  background: #ffffff;
  border: 1px solid #d7d7d7;
  border-radius: 20px;
  padding: 12px 12px;
  box-sizing: border-box;
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
    li {
      position: relative;
      transition: 0.2s linear color;
      text-align: center;

      p {
        width: 100%;
        box-sizing: border-box;
        color: #303030;
        margin: 0;
        height: 36px;
        line-height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid #d7d7d7;
        text-align: left;
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
      // p:last-child {
      //   border-bottom: none;
      // }
    }
  }
}
</style>
