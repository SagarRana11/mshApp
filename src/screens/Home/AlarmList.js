import React, {useEffect, useState, useRef} from 'react';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  Button,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import moment from 'moment';

import {socketConnect} from '../../services/socket';
import LoadingScreen from '../../components/LoaderScreen';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {fetchRequests} from '../../services';
import CalcificCard from '../../components/Card';
import {
  Horizontalscale,
  verticalScale,
  moderateScale,
} from '../../utils/normalize';

const AlarmList = ({navigation}) => {
  const twoDaysAgoUTC = moment().subtract(2, 'days').utc().format();
  const sevenDaysAgoUTC = moment().subtract(7, 'days').utc().format();
  const queryClient = useQueryClient();
  const auth = useSelector(state => state.auth);
  const {user, token} = auth;
  const socketRef = useRef(null);
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} =
    useInfiniteQuery({
      queryKey: ['requests'],
      queryFn: fetchRequests,
      getNextPageParam: lastPage => lastPage?.nextSkip ?? undefined,
    });
  console.log('data>>>>>>>>', data);
  let requests = data?.pages.flatMap(page => page.data) || [];

  const uuidRef = useRef(null);
  const unSubscribePayload = {
    modelId: 'Request',
    uid: uuidRef.current,
    metadata: {
      sort: {
        alarm_raise_on: -1,
      },
      filter: {
        $and: [
          {
            $or: [
              {
                $and: [
                  {
                    status: {
                      $in: [
                        'Completed',
                        'Rejected',
                        'Cancelled',
                        'Reject with transfer',
                      ],
                    },
                  },
                  {
                    status_updated_on: {
                      $gte: twoDaysAgoUTC,
                    },
                  },
                ],
              },
              {
                $and: [
                  {
                    status: {
                      $in: ['Accepted', 'Under Review', 'Pending Review'],
                    },
                  },
                  {
                    $or: [
                      {
                        alarm_raise_on: {
                          $gte: sevenDaysAgoUTC,
                        },
                      },
                      {
                        status_updated_on: {
                          $gte: sevenDaysAgoUTC,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      fields: {
        _id: 1,
        patient_name: 1,
        phone_number: 1,
        case_id: 1,
        role: 1,
        hospital: 1,
        request_status: {
          _id: 1,
        },
        status: 1,
        dob: 1,
        first_medical_contact: 1,
        medical_ref_no: 1,
        location: 1,
        toLocation: 1,
        req_location: 1,
        heart_rate: 1,
        alarm_raise_on: 1,
        temperature: 1,
        oxygen_saturation: 1,
        sbp_dbp: 1,
        sbp: 1,
        dbp: 1,
        map: 1,
        hypotension: 1,
        move_to_cathlab: 1,
        move_to_cathlab_On: 1,
        isShock: 1,
        shock_approval: 1,
        shock_approval_On: 1,
        age_gt_70: 1,
        need_vasopressure: 1,
        heart_rate_gt_90: 1,
        cardiac_arrest: 1,
        anterior_stemi: 1,
        killip_class_gt_2: 1,
        electrical_instability: 1,
        shock: 1,
        accepted_by: 1,
        rejected_by: 1,
        reported_by: 1,
        status_updated_on: 1,
        assign_ems: 1,
        rejectWithTransfer: 1,
        comments: 1,
        cancelRequest: 1,
        aspirin: 1,
        aspirin_dosage: 1,
        brilinta: 1,
        brilinta_dosage: 1,
        heparin: 1,
        heparin_dosage: 1,
        lipitor: 1,
        lipitor_dosage: 1,
        plavix: 1,
        plavix_dosage: 1,
        zofran: 1,
        zofran_dosage: 1,
        manual_activation: 1,
      },
      fieldAggregates: {
        _count: 1,
      },
      _metadata: {},
    },
  };
  // if (socketRef.current) {
  //   socketRef.current.emit('removeSubscribe', unSubscribePayload);
  //   socketRef.current.disconnect();
  //   socketRef.current = null;
  // }

  if (!uuidRef.current) {
    uuidRef.current = uuidv4();
  }

  const updateCallback = event => {
    console.warn('event>>>>>>>>>>>>>>>>>', event);
    const newRequest = event.insert;
    queryClient.setQueryData(['requests'], oldData => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                data: [newRequest, ...page.data],
              }
            : page,
        ),
      };
    });
  };

  const runSubscribe = socket => {
    console.log('>>>>>uuid', uuidRef.current);
    console.log('token>>>>>>', token);
    socket &&
      socket.emit('subscribe', {
        modelId: 'Request',
        uid: uuidRef.current,
        token: token,
        query: {
          _query: {
            id: 'requests',
            addOnFilter: {
              $or: [
                {
                  $and: [
                    {
                      status: {
                        $in: [
                          'Completed',
                          'Rejected',
                          'Cancelled',
                          'Reject with transfer',
                        ],
                      },
                    },
                    {
                      status_updated_on: {
                        $gte: twoDaysAgoUTC,
                      },
                    },
                  ],
                },
                {
                  $and: [
                    {
                      status: {
                        $in: ['Accepted', 'Under Review', 'Pending Review'],
                      },
                    },
                    {
                      $or: [
                        {
                          alarm_raise_on: {
                            $gte: sevenDaysAgoUTC,
                          },
                        },
                        {
                          status_updated_on: {
                            $gte: sevenDaysAgoUTC,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            skip: 0,
            metadata: true,
            limit: 20,
            dataParams: {},
          },
          _metadata: {
            sort: {
              alarm_raise_on: -1,
            },
            filter: {
              'reported_by._id': '65cdfb0f7b9542e2d5a22791',
              $or: [
                {},
                {
                  $and: [{}, {}],
                },
              ],
              $and: [
                {
                  $or: [
                    {
                      $and: [
                        {
                          status: {
                            $in: [
                              'Completed',
                              'Rejected',
                              'Cancelled',
                              'Reject with transfer',
                            ],
                          },
                        },
                        {
                          status_updated_on: {
                            $gte: twoDaysAgoUTC,
                          },
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          status: {
                            $in: ['Accepted', 'Under Review', 'Pending Review'],
                          },
                        },
                        {
                          $or: [
                            {
                              alarm_raise_on: {
                                $gte: sevenDaysAgoUTC,
                              },
                            },
                            {
                              status_updated_on: {
                                $gte: sevenDaysAgoUTC,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            fields: {
              _id: 1,
              patient_name: 1,
              phone_number: 1,
              case_id: 1,
              role: 1,
              hospital: 1,
              request_status: {
                _id: 1,
              },
              status: 1,
              dob: 1,
              first_medical_contact: 1,
              medical_ref_no: 1,
              location: 1,
              toLocation: 1,
              req_location: 1,
              heart_rate: 1,
              alarm_raise_on: 1,
              temperature: 1,
              oxygen_saturation: 1,
              sbp_dbp: 1,
              sbp: 1,
              dbp: 1,
              map: 1,
              hypotension: 1,
              move_to_cathlab: 1,
              move_to_cathlab_On: 1,
              isShock: 1,
              shock_approval: 1,
              shock_approval_On: 1,
              age_gt_70: 1,
              need_vasopressure: 1,
              heart_rate_gt_90: 1,
              cardiac_arrest: 1,
              anterior_stemi: 1,
              killip_class_gt_2: 1,
              electrical_instability: 1,
              shock: 1,
              accepted_by: 1,
              rejected_by: 1,
              reported_by: 1,
              status_updated_on: 1,
              assign_ems: 1,
              rejectWithTransfer: 1,
              comments: 1,
              cancelRequest: 1,
              aspirin: 1,
              aspirin_dosage: 1,
              brilinta: 1,
              brilinta_dosage: 1,
              heparin: 1,
              heparin_dosage: 1,
              lipitor: 1,
              lipitor_dosage: 1,
              plavix: 1,
              plavix_dosage: 1,
              zofran: 1,
              zofran_dosage: 1,
              manual_activation: 1,
            },
            fieldAggregates: {
              _count: 1,
            },
            _metadata: {},
          },
          _fieldAggregates: true,
        },
      });
      // socket.emit('subscribe', {
      //   uid: uuidRef.current,
      //   token: token,
      //   model: 'Request',
      //   query: {
      //     id: 'requests',
      //     addOnFilter: {
      //       $or: [
      //         {
      //           $and: [
      //             {
      //               status: {
      //                 $in: [
      //                   'Completed',
      //                   'Rejected',
      //                   'Cancelled',
      //                   'Reject with transfer',
      //                 ],
      //               },
      //             },
      //             {
      //               status_updated_on: {
      //                 $gte: '2025-04-23T09:45:50.175Z',
      //               },
      //             },
      //           ],
      //         },
      //         {
      //           $and: [
      //             {
      //               status: {
      //                 $in: ['Accepted', 'Under Review', 'Pending Review'],
      //               },
      //             },
      //             {
      //               $or: [
      //                 {
      //                   alarm_raise_on: {
      //                     $gte: '2025-04-18T09:45:50.175Z',
      //                   },
      //                 },
      //                 {
      //                   status_updated_on: {
      //                     $gte: '2025-04-18T09:45:50.175Z',
      //                   },
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     skip: 0,
      //     metadata: true,
      //     limit: 20,
      //     dataParams: {},
      //   },
      //   _metadata: {
      //     sort: {
      //       alarm_raise_on: -1,
      //     },
      //     filter: {
      //       'scheduledAcceptingMD._id': '65e1c5e3ccf87a1a7031cc84',
      //       $or: [
      //         {},
      //         {
      //           $and: [{}, {}],
      //         },
      //       ],
      //       $and: [
      //         {
      //           $or: [
      //             {
      //               $and: [
      //                 {
      //                   status: {
      //                     $in: [
      //                       'Completed',
      //                       'Rejected',
      //                       'Cancelled',
      //                       'Reject with transfer',
      //                     ],
      //                   },
      //                 },
      //                 {
      //                   status_updated_on: {
      //                     $gte: '2025-04-23T09:45:50.175Z',
      //                   },
      //                 },
      //               ],
      //             },
      //             {
      //               $and: [
      //                 {
      //                   status: {
      //                     $in: ['Accepted', 'Under Review', 'Pending Review'],
      //                   },
      //                 },
      //                 {
      //                   $or: [
      //                     {
      //                       alarm_raise_on: {
      //                         $gte: '2025-04-18T09:45:50.175Z',
      //                       },
      //                     },
      //                     {
      //                       status_updated_on: {
      //                         $gte: '2025-04-18T09:45:50.175Z',
      //                       },
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     fields: {
      //       _id: 1,
      //       patient_name: 1,
      //       phone_number: 1,
      //       case_id: 1,
      //       role: 1,
      //       hospital: 1,
      //       request_status: {
      //         _id: 1,
      //       },
      //       status: 1,
      //       dob: 1,
      //       first_medical_contact: 1,
      //       medical_ref_no: 1,
      //       location: 1,
      //       toLocation: 1,
      //       req_location: 1,
      //       heart_rate: 1,
      //       alarm_raise_on: 1,
      //       temperature: 1,
      //       oxygen_saturation: 1,
      //       sbp_dbp: 1,
      //       sbp: 1,
      //       dbp: 1,
      //       map: 1,
      //       hypotension: 1,
      //       move_to_cathlab: 1,
      //       move_to_cathlab_On: 1,
      //       isShock: 1,
      //       shock_approval: 1,
      //       shock_approval_On: 1,
      //       age_gt_70: 1,
      //       need_vasopressure: 1,
      //       heart_rate_gt_90: 1,
      //       cardiac_arrest: 1,
      //       anterior_stemi: 1,
      //       killip_class_gt_2: 1,
      //       electrical_instability: 1,
      //       shock: 1,
      //       accepted_by: 1,
      //       rejected_by: 1,
      //       reported_by: 1,
      //       status_updated_on: 1,
      //       assign_ems: 1,
      //       rejectWithTransfer: 1,
      //       comments: 1,
      //       cancelRequest: 1,
      //       aspirin: 1,
      //       aspirin_dosage: 1,
      //       brilinta: 1,
      //       brilinta_dosage: 1,
      //       heparin: 1,
      //       heparin_dosage: 1,
      //       lipitor: 1,
      //       lipitor_dosage: 1,
      //       plavix: 1,
      //       plavix_dosage: 1,
      //       zofran: 1,
      //       zofran_dosage: 1,
      //       manual_activation: 1,
      //     },
      //     fieldAggregates: {
      //       _count: 1,
      //     },
      //     _metadata: {},
      //   },
      //   fieldAggregates: {
      //     _count: 1,
      //   },
      // });
  };

  useEffect(() => {
  
    if (!socketRef.current) {
      socketRef.current = socketConnect(runSubscribe, event => {
        updateCallback(event);
      });
    }
  
    return () => {
      console.log("Cleanup ran");
      socketRef.current?.disconnect();
    };
  }, []);
  
  if (status === 'pending') return <LoadingScreen />;
  if (status === 'error') return <Text>Error fetching data</Text>;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LinearGradient
        colors={['#cfddfd', 'white', 'white']} // Three colors
        locations={[0, 0.9, 1]} // First color at 0%, Second at 50%, Third at 100%
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={[styles.container, styles.header]}>
        <View style={styles.AlarmHistory}>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.openDrawer()}>
            <Icon source="message-text-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text style={{fontSize: 25, fontWeight: 600}}>Alarm History </Text>
          <Icon
            source="bell-outline"
            size={28}
            color="black"
            style={styles.chatIcon}
          />
        </View>
        <View style={styles.searchBox}>
          <Icon source="magnify" size={28} color="" style={styles.chatIcon} />
          <TextInput placeholder="search" style={styles.textInput} />
        </View>
      </LinearGradient>

      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 160,
          backgroundColor: 'white',
        }}
        data={requests}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <CalcificCard item={item} navigation={navigation} />
        )}
        onEndReached={() => {
          console.log('End reached! Fetching more...');
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    zIndex: 10,
    top: 0,
    backgroundColor: 'white',
  },
  AlarmHistory: {
    width: '95%',
    marginBottom: verticalScale(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: moderateScale(20),
  },
  chatIcon: {
    marginLeft: 'auto',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: Horizontalscale(20),
    width: '90%',
    borderRadius: verticalScale(20),
    marginBottom: Horizontalscale(20),
    padding: Horizontalscale(5),
    borderWidth: 2,
    borderColor: '#4fbfff',
    backgroundColor: '#fff',
  },

  textInput: {
    width: '95%',
    fontSize: moderateScale(18),
    padding: 5,
    paddingLeft: Horizontalscale(10),
  },
});

export default AlarmList;
