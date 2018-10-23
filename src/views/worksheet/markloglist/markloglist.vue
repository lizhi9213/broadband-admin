<template>
  <div>
    <el-card>
      <el-row style="padding-bottom:15px; border-bottom:thin solid #f7f7f7">
        <el-col :span="6">
          <Input v-model="inValue">
          <Button slot="append" icon="ios-search" @click="phone = inValue"></Button>
          </Input>
        </el-col>
        <el-col :span="6">
          <Upload action="https://kejiyuan.xierxinxi.cn:1443/data/upload.ashx?Action=uploadfilephone" :data="postData" :on-exceeded-size="()=>{$message.error('最大支持1M文件')}" :on-format-error="()=>{$message.error('仅支持.xlsx .xls文件')}" :show-upload-list="false" :max-size="1024" :format="['xls','xlsx']" :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError">
            <Button icon="ios-cloud-upload-outline">导入并导出</Button>
            <p slot="tip">仅支持.xlsx .xls文件，且小于1M</p>
          </Upload>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col :span=" 24 ">
          <MarkRecords :phone="phone " />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import MarkRecords from '../component/MarkRecords'
export default {
  name: 'markloglist',
  components: { MarkRecords },
  data() {
    return {
      phone: '',
      inValue: '',
      postData: { Filename: '' }
    }
  },
  methods: {
    beforeUpload(files) {
      this.postData['Filename'] = files['name']
    },
    uploadSuccess(res, file, fileList) {
      if (res.file_name) {
        this.axios
          .get('https://kejiyuan.xierxinxi.cn:1443/data/Report.ashx', {
            params: {
              Action: 'GetAllImportResult',
              fileName: res.file_name
            }
          })
          .then(result => {
            if (result.data.fileName) {
              window.open(
                'https://kejiyuan.xierxinxi.cn:1443/DataExcel/' +
                  result.data.fileName
              )
            } else {
              this.$message.error('无数据')
            }
          })
          .catch(err => {
            this.$message.error('发生错误')
          })
      } else {
        this.$message.error('文件上传失败！')
      }
    },
    uploadError() {
      this.$message.error('文件上传失败！')
    }
  }
}
</script>

