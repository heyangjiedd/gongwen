import {baseUrl,base,exportDataBaser, updateDataBaser} from "@/api/fileupload";
import {Loading,MessageBox} from 'element-ui'


export default {
    data() {
        return {
            baseUrl: baseUrl,
            base: base
        }
    },
    methods: {
        _uuid() {
            const S4 = () => {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            }
            return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
        },
        _downloadCommon() {
            let user = JSON.parse(localStorage.getItem('user'))
            exportDataBaser(1).then(res => {
                const ele = document.createElement('a')
                ele.setAttribute('href', `${this.baseUrl}doc/data/c_id_${user.cid}/user.database`) //设置下载文件的url地址
                ele.click()
            })
        },
        _request(data) {
            var form = new FormData();
            form.append("files", data.file);
            updateDataBaser(1, form).then(res => {
                this.$message.success('操作成功')
            })
        },
        _progress(event, file, fileList) {
            this.loadingInstance = this.loadingInstance || Loading.service({
                text: '请求中',
                background: 'rgba(0, 0, 0, 0.28)'
            });
        },
        _success(data) {
            this.loadingInstance.close();
            if (data.code === 50008 || data.code === 50012 || data.code === 50014) {
                // to re-login
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
                return
            }
            this.$message.success(data.message);
            let path = `${data.filesurl[0].split('.')[0]}`
            this.$router.push({path: '/home/edit', query: {path: path}})
        },
        _before(file) {
            // const isJPG = /.(docx|doc)$/.test(file.name);
            // if (!isJPG) {
            //   this.$message.error('上传word文档!')
            // }
            return true
        },
        _getAuth(id) {
            return this.$store.getters.roles.find(item => {
                return item === id
            })
        },
        _getIds(list, id) {
            let result = [];
            const fn = (pid) => {
                let data = list.find(item => {
                    return pid == item.Id
                });
                result.unshift(data.Id);
                if (data && data.Pid && (data.Pid !== '0')) {
                    fn(data.Pid)
                }
            }
            fn(id);
            return result
        },
        listToTreeData(list, map) {
            if (!Array.isArray(list)) {
                return [];
            }
            list.forEach(item => {
                if (item.Pid) {
                    let parent = list.find(r => {
                        return r.Id === item.Pid;
                    });
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(item);
                    }
                }
            });
            return (map && map.length > 0) ? list.filter(item => {
                item[map[1]] = item[map[0]]
                item[map[3]] = item[map[2]]
                return item.Pid == '0' || item.Pid == null;
            }) : list.filter(item => {
                return item.Pid == '0' || item.Pid == null;
            })
        },
        restForm(formfer, form) {
            this.$refs[formfer] && this.$refs[formfer].resetFields();
            this.$refs[formfer] && this.$refs[formfer].clearValidate();
            this[form] = {};
        }
    },
}
