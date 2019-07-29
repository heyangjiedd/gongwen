<template>
    <div>
        <div class="title-container"style="padding: 20px 20px 10px 20px;background: #231815 ">
            <img :style="{width: '100%'}" :src="img_404_cloud" alt="蓉易公文™-党政机关公文处理平台">
        </div>

        <scroll-bar>

            <el-menu
                    mode="vertical"
                    :show-timeout="200"
                    :default-active="$route.path"
                    :collapse="isCollapse"
                    background-color="#304156"
                    text-color="#bfcbd9"
                    active-text-color="#409EFF"
            >
                <sidebar-item :routes="routes"></sidebar-item>
            </el-menu>
        </scroll-bar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import SidebarItem from './SidebarItem'
    import ScrollBar from '@/components/ScrollBar'
    import img_404_cloud from '@/assets/logov2.jpg'

    export default {
        data() {
            return {img_404_cloud}
        },
        components: {SidebarItem, ScrollBar},
        computed: {
            ...mapGetters([
                'sidebar'
            ]),
            routes() {
                return this.$router.options.routes
            },
            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
<style lang="scss" scoped>
    /deep/.scroll-container {
        background: #231815 !important;
        .el-submenu {
            background: #231815 !important;
        }
        .el-submenu__title {
            background: #231815 !important;
        }
        .el-menu {
            background: #231815 !important;
        }
        .el-menu-item {
            background: #231815 !important;
        }
    }
</style>
