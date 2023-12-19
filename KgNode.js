import { clearConfigCache } from "prettier";
import zj1data from '@assets/json/kg/zj1.json';
import zj2data from '@assets/json/kg/zj2.json';
import zj3data from '@assets/json/kg/zj3.json';
import zj4data from '@assets/json/kg/zj4.json';
import zj5data from '@assets/json/kg/zj5.json';
import zj6data from '@assets/json/kg/zj6.json';//桩基 Pile foundation 0

import ctdata from '@assets/json/kg/ct.json';//承台 Abutment 1

import tzdata from '@assets/json/kg/tz.json';//塔座 Tower piers 2

import tsdata from '@assets/json/kg/ts.json';//台身 Pier shaft 3

import dsdata from '@assets/json/kg/ds.json';//垫石 Bearing pad 4

import tazhudata from '@assets/json/kg/tazhu.json';//塔柱Tower Column 5
 
import jiajldata from '@assets/json/kg/jiajl.json';//加劲梁 Diaphragm 6

import hldata from '@assets/json/kg/hl.json' //横梁 Crossbeam 7

import sdmdata from '@assets/json/kg/sdm.json' //隧道锚 Tunnel anchor 8

import lansuo from '@assets/json/kg/lansuo.json' //缆索 Cables 9

import land from '@assets/json/kg/land.json' //Land 10

import house from '@assets/json/kg/House.json' //House 11

import temSturc from '@assets/json/kg/temporary.json' //Temporary structure 12

import temp from '@assets/json/kg/temperature.json'//Temperature 13

import river from '@assets/json/kg/river.json' //River 14

import con1 from '@assets/json/kg/relation/connect.json';//关系1

import con2 from '@assets/json/kg/relation/connect_new.json';//关系2

import con3 from '@assets/json/kg/relation/connect3.json';//关系3
import con4 from '@assets/json/kg/relation/connect4.json';//关系4

import cls1 from '@assets/json/kg/relation/class1.json';//包含1
import qg from '@assets/json/kg/relation/qgcon.json';//桥梁与地理1



// export function nodeCreate(viewer,modelLayer){

//     // console.log(modelLayer['ModelLayer']);
//     let models = modelLayer['ModelLayer']

//     for(let ly in modelLayer['ModelLayer']){

//         var ens = models[ly].entities.values;
//         //console.log(ens); 
//         for(let f in ens){
//             // console.log(ens[f])
//             var e = ens[f];
//             // console.log(e);
//             // const sp = e.boundingSphere;
//             // const position = e.position.getValue(viewer.clock.currentTime);
//             // const modelMatrix = Cesium.Matrix4.fromTranslation(position);
//             // console.log(modelMatrix);
//             // var pos = e.position.getValue(Cesium.JulianDate.now());
//             // console.log(pos);
//             // createSphere(viewer,pos,3.0);
//             const boundingSphere = new Cesium.BoundingSphere();
//             viewer.dataSourceDisplay.getBoundingSphere(
//               e,
//               false,
//               boundingSphere
//             );
//             // console.log(boundingSphere.center);
//             var pos = boundingSphere.center;
//             // viewer.camera.viewBoundingSphere(boundingSphere);
//             createSphere(viewer,pos,5.0); 
//         }

//     }
// }

var Ctype = ["Pile foundation","Abutment","Tower piers","Pier shaft","Bearing pad","Tower Column","Diaphragm","Crossbeam","Tunnel anchor","Cables","Land","House","Temporary structure","Temperature","River"]

var NodeLayer=[];
export function nodeCreate(viewer,modelLayer){
  
  // console.log(zj1data);
//节点Layer定义

  //桩基
  readKgJson(zj1data,viewer);
  readKgJson(zj2data,viewer);
  readKgJson(zj3data,viewer);
  readKgJson(zj4data,viewer);
  readKgJson(zj5data,viewer);
  readKgJson(zj6data,viewer);

  // //承台
  readKgJson(ctdata,viewer);

  //塔座
  readKgJson(tzdata,viewer);

  //台身
  readKgJson(tsdata,viewer);

  //垫石
  readKgJson(dsdata,viewer);

  //塔柱
  readKgJson(tazhudata,viewer);

  //加劲梁
  readKgJson(jiajldata,viewer);

  //横梁
  readKgJson(hldata,viewer);

  //隧道锚
  readKgJson(sdmdata,viewer);

  //缆索
  readKgJson(lansuo,viewer);

  //Land
  readKgJson(land,viewer);
    //House
  readKgJson(house,viewer);
  //临时建筑
  readKgJson(temSturc,viewer);
    //温度
  readKgJson(temp,viewer);
  //River
  readKgJson(river,viewer);
//Land
  readKgJson(land,viewer);
  //Land
  readKgJson(land,viewer);


  //关系读取
  readRJson(con1,viewer);
  readRJson(con2,viewer);
  readRJson(con3,viewer);
  readRJson(con4,viewer);

  readRJson(cls1,viewer);
  readRJson(qg,viewer);

}


//读取节点的JSON文件
function readKgJson(data,viewer){

  // console.log(data);
  var collection = data['children'];
  var dataType = data['type'];

  for(let col in collection){
    
    var obj = collection[col];
    var pos = obj['pos'];
    var id = obj['id'];
    // console.log(pos);
    var e = createSphere(viewer,pos,id,2.0,dataType);
    NodeLayer.push(e);

  }
  // console.log(collection);
  // console.log(NodeLayer);
}

//读取关系的Json
function readRJson(data,viewer){

  // console.log(data);
  for(var d in data['relation']){
    var relCol = data['relation'][d];
    var startCol = relCol['start'];
    var endCol = relCol['end'];
    var relName = relCol['relation'];
    
    //读取到起始点与终点的集合后，用起始点去连接终点，因此先遍历终点，每个终点去遍历起点

    for(var i in endCol){
      var endNode = endCol[i];
      for(var j in startCol){
        var startNode = startCol[j];
        createLine(startNode,endNode,relName,viewer);
      }

    }


  }


}



function createSphere(viewer,pos,id,radius=10.0,type){

//根据类型返回绘制球的颜色及大小
var style = getStyleOfNode(type);
var colorS = style['rgba'];
radius = style['size']; 
var offset = style['offset'];
pos.x = pos.x-offset[0];
pos.y = pos.y-offset[1];
pos.z = pos.z-offset[2];

// console.log(pos.x);

// 创建球形实体
  const entity = viewer.entities.add({
    name: id,
    position: pos,
    ellipsoid: {
      radii: new Cesium.Cartesian3(radius, radius, radius),
      // material: Cesium.Color.RED.withAlpha(1.0),
      // material: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
      material: new Cesium.Color(colorS[0], colorS[1], colorS[2], colorS[3])
    },
  });

  //在球上面创建文字显示
  var c = Ctype.indexOf(type);
  var text = Ctype[c]+'\n'+id;
  var labelEntity = viewer.entities.add({
    position: pos,
    label: {
      text: text,
      font: '24px sans-serif',
      showBackground: true,
      backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      pixelOffset: new Cesium.Cartesian2(0, 5),
      // translucencyByDistance: new Cesium.NearFarScalar(100, 1.0, 1000, 0.0)//根据距离设置透明度
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100.0)//根据距离设置显示状态
    }
  });
  return entity;
}


//获取节点的样式 也就是画什么样的球
function getStyleOfNode(type){

  var styleDict={
    'size':2.0,
    'rgba':[238/255.0,121/255.0,66/255.0, 1.0],
    'offset':[0.0,0.0,0.0]
  }
  var s = Ctype.indexOf(type);

  if(s==-1){
    return styleDict;
  }

  if(s==1){
    styleDict['size']=4.0;
    styleDict['rgba'] = [238/255.0,121/255.0,66/255.0, 1.0];
    styleDict['offset']=[0.0,0.0,10.0];
  }

  else if(s==2){
    styleDict['rgba'] = [238/255.0,121/255.0,66/255.0, 1.0];
  }

  else if(s==3){
    styleDict['rgba'] = [1.0, 1.0, 0.0, 1.0];
    styleDict['offset']=[10.0,10.0,0.0];
  }
  else if(s==9){
    styleDict['size']=10.0;
    styleDict['rgba'] = [176/255.0,226/255.0,255/255.0, 1.0];//176,226,255
    styleDict['offset']=[0.0,0.0,-30.0];
  }
  else if(s==10){
    styleDict['size']=8.0;
    styleDict['rgba'] = [190/255.0,190/255.0,190/255.0, 1.0];

  }
  else if(s==11){
    styleDict['size']=8.0;
    styleDict['rgba'] = [150/255.0,205/255.0,205/255.0, 1.0];
  }
  else if(s==12){
    styleDict['size']=8.0;
    styleDict['rgba'] = [110/255.0,139/255.0,61/255.0, 1.0];
  }
  else if(s==13){
    styleDict['size']=5.0;
    styleDict['rgba'] = [255/255.0,48/255.0,48/255.0, 1.0]; 
    styleDict['offset']=[0.0,0.0,-200.0];
  }
  else if(s==14){
    styleDict['size']=10.0;
    styleDict['rgba'] = [30/255.0,144/255.0,255/255.0, 1.0]; 
  }

  

  return styleDict;

}


//查找节点
function seekEntity(Ename){
  // var entity = viewer.entities.getEntityByName(Ename);
  var entity;
  var flag=-1;
  for(var i in NodeLayer){
    var seekName = NodeLayer[i]._name;
    if(Ename==seekName){
      flag=i;
      break;
    }

  }
  if(flag==-1){
    return null;
  }
  else{
    entity = NodeLayer[flag];
  }

return entity;

}


//根据节点画线
function createLine(satrt,end,name,viewer){
//根据名称获取两个节点
var nodeS = seekEntity(satrt);
var nodeE = seekEntity(end);

if(nodeS==null||nodeE==null){
  console.log("error",satrt,end);
  return;
}

  // 创建颜色渐变线 与节点颜色相同
  var c1 = nodeS.ellipsoid.material.color.getValue();//颜色1
  var c2 = nodeE.ellipsoid.material.color.getValue();//颜色2


  var posS = nodeS.position._value;// 获取实体的位置
  var posE = nodeE.position._value;


  var positions = [
      posS,
      posE
  ];

  var material = new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.2,
      color: c2//Cesium.Color.mod(c1, c2, new Cesium.Color())
      // color: Cesium.Color.BLUE
  });
  var polyline = viewer.entities.add({
      polyline: {
          positions: positions,
          width: 2,
          material: material
      }
  });

  var midpoint = Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3());
  var label = viewer.entities.add({
      position: midpoint,
      label: {
          text: name,
          font: '12px Helvetica',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, 5),
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100.0)//根据距离设置显示状态
      }
  });
 
  
}




// function createSphere(viewer,pos,radius=10.0){

//   var earthPosition = Cesium.Cartesian3.fromDegrees(
//     102.22891564,
//     29.92799647,
//     1798.8749
//   );
//   var deltaX=pos.x-earthPosition.x;
//   var deltaY=pos.y-earthPosition.y;
//   var deltaZ=pos.z-earthPosition.z;
//   const point={x:deltaX,y:deltaY,z:deltaZ};

//   			//(2)旋转
// 			//(2.1) 绕x轴旋转
// 			var x0 = point.x; //右+ 1.15; //左+ 0.65;
// 			var y0 = point.y; //+ 0.5;
// 			var z0 = point.z; //右+ 7;
// 			var rotateX =(206.6* 3.1415926535) / 180;
// 			point.x = x0;
// 			point.y = y0 * Math.cos(rotateX) - z0 * Math.sin(rotateX);
// 			point.z = y0 * Math.sin(rotateX) + z0 * Math.cos(rotateX);
// 			//(2.2) 绕y轴旋转
// 			var x1 = point.x;
// 			var y1 = point.y;
// 			var z1 = point.z;
// 			var rotateY =(235.4  * 3.1415926535) / 180;
// 			point.x = x1 * Math.cos(rotateY) + z1 * Math.sin(rotateY);
// 			point.y = y1;
// 			point.z = -x1 * Math.sin(rotateY) + z1 * Math.cos(rotateY);
// 			//(2.3) 绕z轴旋转
// 			var x2 = point.x;
// 			var y2 = point.y;
// 			var z2 = point.z;
// 			var rotateZ = (71.2* 3.1415926535) / 180;
// 			point.x = x2 * Math.cos(rotateZ) - y2 * Math.sin(rotateZ);
// 			point.y = x2 * Math.sin(rotateZ) + y2 * Math.cos(rotateZ);
// 			point.z = z2;

//       //(3)原始坐标加上旋转后的参数
// 			earthPosition.x += point.x;
// 			earthPosition.y += point.y;
// 			earthPosition.z += point.z;

// // 创建球形实体
//   const entity = viewer.entities.add({
//     name: '实体',
//     position: earthPosition,
//     ellipsoid: {
//       radii: new Cesium.Cartesian3(radius, radius, radius),
//       material: Cesium.Color.RED.withAlpha(1.0),
//     },
//   });

// }