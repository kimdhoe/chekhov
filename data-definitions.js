// -------------------------------------
// Data Definitions
// -------------------------------------

// A ChatRoom is an object: { id:           string
//                          , title:        string
//                          , color:        string
//                          , participants: string[]
//                          }
//   * participants - IDs of current participants.

// A Message is an object: { sender: string?
//                         , type:   'announcement' | 'default'
//                         , text:   string
//                         , error:  string?
//                         }

// A RegisterResponse is an object: { ok:       boolean
//                                  , message:  string?
//                                  }

// A ListResponse is an object: { ok:    boolean
//                              , rooms: ChatRoom[]
//                              }

// A JoinRequest is an object: { roomID: string
//                             , userID: string
//                             }

// A LeaveRequest is an object: { roomID: string
//                              , userID: string
//                              }