<template>
  <el-table :data="tableData6"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px">
    <el-table-column prop="id"
                     :label="$t('位置')">
    </el-table-column>
    <el-table-column prop="id"
                     :label="$t('字段')">
    </el-table-column>
    <el-table-column v-for="(timeLabel, index) in timeLabels"
                     :key="timeLabel"
                     :label="timeLabel">
      <template slot-scope="scope">
        {{ scope.row.data[index] }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('sum')">
      <template slot-scope="scope">
        {{ scope.row.data[index] }}
      </template>
      <el-table-column>
  </el-table>
</template>
