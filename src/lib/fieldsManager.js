const fieldsManager = {
  DomainLabel: {
    displayI18Key: 'store',
    unitI18Key: null
  },
  // -----------------------
  Enter: {
    displayI18Key: 'enter',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Exit: {
    displayI18Key: 'exit',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Stay: {
    displayI18Key: 'stay',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Passby: {
    displayI18Key: 'passby',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  EnteringRate: {
    displayI18Key: 'enteringRate',
    unitI18Key: 'e/p',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value + '%'
    }
  },
  // -------------------------------
  Fitting: {
    displayI18Key: 'fitting',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  FittingRate: {
    displayI18Key: 'fittingRate',
    unitI18Key: 'visitors',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value + '%'
    }
  },
  // --------------------------

  Sales: {
    displayI18Key: 'sales',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Receipts: {
    displayI18Key: 'receipts',
    unitI18Key: 'times',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Pieces: {
    displayI18Key: 'pieces',
    unitI18Key: 'times',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  ConvertRate: {
    displayI18Key: 'convertRate',
    unitI18Key: 't/p',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value + '%'
    }
  },
  PricePerCustomer: {
    displayI18Key: 'pricePerCustomer',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  PiecePerCustomer: {
    displayI18Key: 'piecePerCustomer',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  PricePerReceipt: {
    displayI18Key: 'pricePerReceipt',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  PiecePerReceipt: {
    displayI18Key: 'piecePerReceipt',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  PricePerPiece: {
    displayI18Key: 'pricePerPiece',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Clerk: {
    displayI18Key: 'clerk',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  ClerkRatio: {
    displayI18Key: 'clerkRatio',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  Acreage: {
    displayI18Key: 'acreage',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  WeatherName: {
    displayI18Key: 'weatherName',
    unitI18Key: '',
    sortable: false,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  },
  HighTemp: {
    displayI18Key: 'highTemp',
    unitI18Key: 'tempUnit',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      switch (locale) {
        case 'zh-Cn':
          return value + '℃'
        case 'en':
          return 32 + value * 1.8 + '℉'
        default:
          return value + '℃'
      }
    }
  },
  LowTemp: {
    displayI18Key: 'lowTemp',
    unitI18Key: 'tempUnit',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      switch (locale) {
        case 'zh-Cn':
          return value + '℃'
        case 'en':
          return 32 + value * 1.8 + '℉'
        default:
          return value + '℃'
      }
    }
  },
  ActivityName: {
    displayI18Key: 'activityName',
    unitI18Key: '',
    sortable: true,
    tableDisplayFunc: function (value, locale) {
      return value
    }
  }
}
export default fieldsManager
