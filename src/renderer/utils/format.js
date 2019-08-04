import {baseUrl,base} from "@/api/fileupload";


export default {
  data(){
    return {
        baseUrl:baseUrl,
        base:base
    }
  },
  methods: {
    _getAuth(id){
      return  this.$store.getters.roles.find(item=>{return item===id})
    },
    _getIds(list,id){
        let result = [];
        const fn = (pid)=>{
          let data = list.find(item=>{return pid == item.Id});
          result.unshift(data.Id);
          if(data&&data.Pid&&(data.Pid!=='0')){
            fn(data.Pid)
          }
        }
        fn(id);
        return result
    },
    listToTreeData(list,map) {
      if (!Array.isArray(list)) {
        return [];
      }
      list.forEach(item => {
        if (item.Pid) {
          let parent = list.find(r => {
            return r.Id === item.Pid;
          });
          if(parent){
            parent.children = parent.children || [];
            parent.children.push(item);
          }
        }
      });
      return (map&&map.length>0)?list.filter(item=>{
          item[map[1]]=item[map[0]]
          item[map[3]]=item[map[2]]
        return item.Pid=='0'||item.Pid==null;
      }):list.filter(item=>{
        return item.Pid=='0'||item.Pid==null;
      })
    },
    restForm(formfer, form) {
      this.$refs[formfer]&&this.$refs[formfer].resetFields();
      this.$refs[formfer]&&this.$refs[formfer].clearValidate();
      this[form] = {};
    }
  },
}
