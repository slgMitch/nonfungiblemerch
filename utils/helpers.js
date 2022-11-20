import _ from 'lodash'

export function createApparelObject(documents) {
    const apparel =  _.groupBy(documents, 'productCategory')
    return apparel
}