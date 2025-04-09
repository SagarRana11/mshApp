import io from 'socket.io-client';
export function socketConnect(runSubcribe, cb) {
  try {
    const socket = io.connect("https://uatsocket.stemicathaid.com", {
      transports: ['polling', 'websocket'],
    });
    console.log('socket>>>>>>>>>>>>>>>>>>>>>>>>', socket);
    socket.on('connect', () => {
      console.log('>>>>>>>socket connected at client');
      runSubcribe && runSubcribe(socket);
    });
    socket.on('disconnect', () => {
      console.log('>>>>>>>socket disconnected at client.');
      socket.io.reconnect();
    });
    socket.on('error', err => {
      console.log('>>>>>>Error in on connect Socket ::: ', err);
    });
    socket.on('connect_error', err => {
      console.log('>>>>>>>Scoket connect Error ::: ', err);
    });

    //   const runSubscribe = () => {
    //     console.log('>>>>>uiquwsubscribe');
    //     socket &&
    //       socket.emit('subscribe', {
    //         modelId: 'Request',
    //         uid: '-----------uiiididid',
    //         token: token,
    //         query: {
    //           _query: {
    //             id: 'requests',
    //             addOnFilter: {
    //               $or: [
    //                 {
    //                   $and: [
    //                     {
    //                       status: {
    //                         $in: [
    //                           'Completed',
    //                           'Rejected',
    //                           'Cancelled',
    //                           'Reject with transfer',
    //                         ],
    //                       },
    //                     },
    //                     {
    //                       status_updated_on: {
    //                         $gte: twoDaysAgoUTC,
    //                       },
    //                     },
    //                   ],
    //                 },
    //                 {
    //                   $and: [
    //                     {
    //                       status: {
    //                         $in: ['Accepted', 'Under Review', 'Pending Review'],
    //                       },
    //                     },
    //                     {
    //                       $or: [
    //                         {
    //                           alarm_raise_on: {
    //                             $gte: sevenDaysAgoUTC,
    //                           },
    //                         },
    //                         {
    //                           status_updated_on: {
    //                             $gte: sevenDaysAgoUTC,
    //                           },
    //                         },
    //                       ],
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //             skip: 0,
    //             metadata: true,
    //             limit: 20,
    //             dataParams: {},
    //           },
    //           _metadata: {
    //             sort: {
    //               alarm_raise_on: -1,
    //             },
    //             filter: {
    //               'scheduledAcceptingMD._id': '65e1c5e3ccf87a1a7031cc84',
    //               $or: [
    //                 {},
    //                 {
    //                   $and: [{}, {}],
    //                 },
    //               ],
    //               $and: [
    //                 {
    //                   $or: [
    //                     {
    //                       $and: [
    //                         {
    //                           status: {
    //                             $in: [
    //                               'Completed',
    //                               'Rejected',
    //                               'Cancelled',
    //                               'Reject with transfer',
    //                             ],
    //                           },
    //                         },
    //                         {
    //                           status_updated_on: {
    //                             $gte: twoDaysAgoUTC,
    //                           },
    //                         },
    //                       ],
    //                     },
    //                     {
    //                       $and: [
    //                         {
    //                           status: {
    //                             $in: ['Accepted', 'Under Review', 'Pending Review'],
    //                           },
    //                         },
    //                         {
    //                           $or: [
    //                             {
    //                               alarm_raise_on: {
    //                                 $gte: sevenDaysAgoUTC,
    //                               },
    //                             },
    //                             {
    //                               status_updated_on: {
    //                                 $gte: sevenDaysAgoUTC,
    //                               },
    //                             },
    //                           ],
    //                         },
    //                       ],
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //             fields: {
    //               _id: 1,
    //               patient_name: 1,
    //               phone_number: 1,
    //               case_id: 1,
    //               role: 1,
    //               hospital: 1,
    //               request_status: {
    //                 _id: 1,
    //               },
    //               status: 1,
    //               dob: 1,
    //               first_medical_contact: 1,
    //               medical_ref_no: 1,
    //               location: 1,
    //               toLocation: 1,
    //               req_location: 1,
    //               heart_rate: 1,
    //               alarm_raise_on: 1,
    //               temperature: 1,
    //               oxygen_saturation: 1,
    //               sbp_dbp: 1,
    //               sbp: 1,
    //               dbp: 1,
    //               map: 1,
    //               hypotension: 1,
    //               move_to_cathlab: 1,
    //               move_to_cathlab_On: 1,
    //               isShock: 1,
    //               shock_approval: 1,
    //               shock_approval_On: 1,
    //               age_gt_70: 1,
    //               need_vasopressure: 1,
    //               heart_rate_gt_90: 1,
    //               cardiac_arrest: 1,
    //               anterior_stemi: 1,
    //               killip_class_gt_2: 1,
    //               electrical_instability: 1,
    //               shock: 1,
    //               accepted_by: 1,
    //               rejected_by: 1,
    //               reported_by: 1,
    //               status_updated_on: 1,
    //               assign_ems: 1,
    //               rejectWithTransfer: 1,
    //               comments: 1,
    //               cancelRequest: 1,
    //               aspirin: 1,
    //               aspirin_dosage: 1,
    //               brilinta: 1,
    //               brilinta_dosage: 1,
    //               heparin: 1,
    //               heparin_dosage: 1,
    //               lipitor: 1,
    //               lipitor_dosage: 1,
    //               plavix: 1,
    //               plavix_dosage: 1,
    //               zofran: 1,
    //               zofran_dosage: 1,
    //               manual_activation: 1,
    //             },
    //             fieldAggregates: {
    //               _count: 1,
    //             },
    //             _metadata: {},
    //           },
    //         },
    //       });
    //   };
    socket.on('onServerUpdate', event => {
      console.log('>>>>>>>>>onServerUpdate', event);
      cb && cb(event);
    });

    return socket;
  } catch (error) {
    console.warn('error>>>>>', error);
  }
}
