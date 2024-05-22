<template>
	<div class="left"></div>
	<div class="container" v-bind="$attrs">
    <el-tabs v-model="activeName" class="tabs" tab-position="left">
      <el-tab-pane label="使用趋势" name="chart">
        <div class="chart" ref="chart"></div>
      </el-tab-pane>
      <el-tab-pane label="记录列表" name="list" status-icon>
        <el-table 
          :row-class-name="rowClassName"
          :data="tableData" 
          style="width: 100%" 
          max-height="70vh"
        >
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="recog_date" label="日期" :formatter="dateFormatter" width="150" align="center" />
          <el-table-column prop="recog_result" label="识别结果" width="150" align="center" />
          <el-table-column prop="img" label="图片" width="350" align="center">
            <template #default="{ row }">
              <img :src="`http://localhost:8080/images/recog/${row.id}.jpg`" alt="图片" style="width: 200px; height: 200px" />
            </template>
          </el-table-column>
          <el-table-column prop="score" label="用户评价" :formatter="scoreFormatter" width="150" align="center" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
	<div class="right"></div>
</template>

<script setup lang="ts">
	import { ref, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
	import { getRecogRecords, getSevenDayData } from '@/api/manageRecog'
	import type { RecogRecordsItem } from '@/utils/types'
	import * as echarts from 'echarts/core'
	import { BarChart, LineChart } from 'echarts/charts'
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		// 数据集组件
		DatasetComponent,
		// 内置数据转换器组件 (filter, sort)
		TransformComponent,
    LegendComponent
	} from 'echarts/components'
	import { LabelLayout, UniversalTransition } from 'echarts/features'
	import { CanvasRenderer } from 'echarts/renderers'
	import type {
		// 系列类型的定义后缀都为 SeriesOption
		BarSeriesOption,
		LineSeriesOption,
	} from 'echarts/charts'
	import type {
		// 组件类型的定义后缀都为 ComponentOption
		TitleComponentOption,
		TooltipComponentOption,
		GridComponentOption,
		DatasetComponentOption,
	} from 'echarts/components'
	import type { ComposeOption } from 'echarts/core'

  // 折线图
  // #region
	// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
	type ECOption = ComposeOption<
		| BarSeriesOption
		| LineSeriesOption
		| TitleComponentOption
		| TooltipComponentOption
		| GridComponentOption
		| DatasetComponentOption
	>

	// 注册必须的组件
	echarts.use([
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		BarChart,
		LineChart,
		LabelLayout,
		UniversalTransition,
		CanvasRenderer,
    LegendComponent
	])

  const activeName = ref('chart')
	const tableData = ref<RecogRecordsItem[]>()
  const chart = ref<HTMLElement>()
  const chartInstance = ref<echarts.ECharts>()

  // 用一个数组按照正序存储最近七天的日期，以yyyy-MM-dd格式
  const dateArr = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()
  
  const option = ref({
    title: {
      text: '近七日本系统图像识别功能使用次数统计'
    },
    tooltip: {},
    legend: {
      data: ['使用次数']
    },
    xAxis: {
      data: dateArr
    },
    yAxis: {},
    series: [
      {
        name: '使用次数',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
  // #endregion

  // 列表页
  // #rgeion
  const dateFormatter = (row: RecogRecordsItem) => {
    return new Date(row.recog_date).toLocaleDateString()
  }

  const scoreFormatter = (row: RecogRecordsItem) => {
    switch (row.score) {
      case 0:
        return '不准确'
      case 1:
        return '准确'
      case 2:
        return '不清楚/未评价'
    }
  }

  // 根据row的score值，设置不同的行样式，如果score为0，设置为警告样式，为1设置为成功样式
  const rowClassName = ({ row }: { row: RecogRecordsItem }) => {
    switch (row.score) {
      case 0:
        return 'warning-row'
      case 1:
        return 'success-row'
      default:
        return ''
    }
  }
  // #endregion

	onBeforeMount(async () => {
		try {
			tableData.value = (await getRecogRecords()).records
      option.value.series[0].data = (await getSevenDayData()).daily
      chartInstance.value!.setOption(option.value)
		} catch (err) {
			console.error(err)
		}
	})

  const resize = () => {
    chartInstance.value?.resize()
  }

  onMounted(() => {
    chartInstance.value = echarts.init(chart.value)
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    chartInstance.value?.dispose()
    window.removeEventListener('resize', resize)
  })
</script>

<style scoped lang="less">
	.left,
	.right {
		width: 10vw;
		height: 100%;
		background-color: #f0f0f0;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;

    .tabs {
      height: 100%;
      width: 100%;

      & :deep(.el-tabs__item) {
        font-size: 1.2rem;
        font-weight: 600;
        height: 10vh;
      }

      & :deep(.el-tabs__content) {
        height: 100%;
        padding: 20px;
        color: #6b778c;
        font-size: 32px;
        font-weight: 600;

        .el-tab-pane {
          height: 100%;
          width: 100%;

          .chart {
            height: 100%;
            width: 90%;
          }

          .el-table {
            .warning-row {
              --el-table-tr-bg-color: var(--el-color-warning-light-9);
            }

            .success-row {
              --el-table-tr-bg-color: var(--el-color-success-light-9);
            }
          }
        }
      }
    }
	}

</style>
