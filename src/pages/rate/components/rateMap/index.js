import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import F2 from '~/components/f2-canvas/lib/f2';
import './index.less';

var chart = null;
var data = [];

function initChart(canvas, width, height) { // 使用 F2 绘制图表
  // const data = [];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    value: {
      type: 'linear'
    },
    time: {
      type: 'timeCat',
      mask: 'HH:mm'
    }
  });
  chart.legend('type', {
    align: 'center',
    itemWidth: 120,
    marker: 'square'
  });
  chart.guide().text({
    position: ['min', 'max'],
    content: '汇率',
    style: {
      textBaseline: 'middle',
      textAlign: 'start'
    },
    offsetY: -23,
    offsetX: -46
  })
  chart.guide().text({
    position: ['max', 'min'],
    content: '时间',
    style: {
      textBaseline: 'middle',
      textAlign: 'start'
    },
    offsetY: 26,
    offsetX: -23
  })
  chart.tooltip({
    // showItemMarker: true,
    custom:true,
    // onShow(ev) {
    //   console.log(ev);
    //   // const { items } = ev;
    //   // items[0].name = null;
    //   // items[0].name = items[0].title;
    //   // items[0].value = '¥ ' + items[0].value;
    // },
    onChange: function onChange(obj) {
      var legend = chart.get('legendController').legends.top[0];
      var tooltipItems = obj.items;
      var legendItems = legend.items;
      var map = {};
      legendItems.map(function(item) {
        map[item.name] = JSON.parse(JSON.stringify(item));
      });
      tooltipItems.map(function(item) {
        var name = item.name;
        var value = item.value;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide: function onHide() {
      var legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.line().position('time*value').color('type');
  chart.render();
  return chart;
}

class RateMap extends Component {
  config = {
    usingComponents: {
      'ff-canvas': '../../../../components/f2-canvas/f2-canvas'
    }
  }
  state = {
    opts: {
      onInit: initChart
    }
  }
  // componentDidMount(){
  //   const { exchangeRates } = this.props;
  //   let rates = [];
  //   exchangeRates.map(item => {
  //     rates.push({
  //       type:'妙汇宝',
  //       value: item.sys_exchange_rate,
  //       time:item.time
  //     },{
  //       type:'中国银行',
  //       value: item.boc_exchange_rate,
  //       time:item.time
  //     })
  //   })
  //   setTimeout(() => {
  //     chart.changeData(rates);
  //     // console.log(chart);
  //   }, 20);
  // }
  componentWillUnmount(){
    chart.destroy();
  }
  render() {
    const { opts } = this.state;
    const { exchangeRates } = this.props;
    exchangeRates.map(item => {
      data.push({
        type:'妙汇宝',
        value: item.sys_exchange_rate,
        time:item.time
      },{
        type:'中国银行',
        value: item.boc_exchange_rate,
        time:item.time
      })
    })
    return (
      <View class='container'>
        <View class='chart-block'>
          {
            !!exchangeRates.length && <ff-canvas canvas-id='column' opts={opts}></ff-canvas>
          }
        </View>
      </View>
    );
  }
}

export default RateMap;

RateMap.defaultProps = {
  exchangeRates: [],
}