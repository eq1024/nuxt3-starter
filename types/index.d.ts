declare namespace App {
  interface TreeNode {
    'row-text': string
    'type': number
    'children'?: TreeNode[]
    '_shouldBeEditing'?: boolean
  }

  interface Tool {
    id: number
    name: string
    self_categories_id: string
    num: number
    author_id: number
    relate_id: number
    img: string
    created_at: string
    updated_at: string
    author_info: {
      id: number
      account: string
      name: string
      email: string | null
      phone: string | null
    }
    tools_info: {
      id: number
      name: string
      self_categories_id: string
      num: number
      author_id: number
      img: string
      created_at: string
      updated_at: string
    }
  }

  interface Part {
    name: string // 配件名称-改
    id: number
    relate_id: number
    compatibility: string // 兼容性
    description: string // 描述
    img: string // 图片链接
    company: string // 客户名称
    parts_info: {
      id: number
      name: string
      compatibility: string
      description: string
      img: string
      created_at: string
      updated_at: string
      shop_part_details_list: {
        id: number
        part_id: number
        sales_area: number
        sku: string
        price: string
        status?: number
        created_at?: string
        updated_at?: string
      }[]
    }
  }

  interface ShopPart {
    num: number
    part_id: number
    sku: string
    price: string
  }

  interface Category {
    id: string
    name: string
    brand_name?: string
    des: string
    img: string
    level?: number
    pid?: number
    select?: any
    type: number
    breadcrumb: Record<string, string>
    children?: Category[]
  }

  interface GuideStepInfo {
    id?: number
    detail_id: number
    sort: number
    title: string
    content: TreeNode[]
    attachment?: string
    created_at?: string
    updated_at?: string
    type?: 'image' | 'media'
    image: (string | null)[]
    media: any[]
  }

  interface GuideDetail {
    id?: number
    author_id: number // 必填
    author_info: {
      id: number
      name: string
      account: string
      email: string
      phone: string
      self_user_type: number
    }

    self_categories_id: number // 必填
    device: number // 必填
    type: number // 必填
    name: string // 必填
    title: string // 必填
    time_min: number // 必填
    time_max: number // 必填
    level: number // 必填
    img: string // 必填
    introduction?: string
    conclusion?: string
    parts?: number[]
    get_parts_info?: Part[]
    tools?: number[]
    get_tools_info?: Tool[]
    status?: number
    is_delete?: number
    read?: number
    comments?: number
    collections?: number
    completeds?: number
    created_at?: string
    updated_at?: string
    step_info?: GuideStepInfo[]
    tag_id?: number
    brand_id?: number
  }

  interface Tutorials {
    id: number
    name: string
    des: string
    img: string
    pid: number
    level: number
    created_at: string
    updated_at: string
    type: number
    brand_id: number
    breadcrumb: Record<string, string>
    tutorial: GuideDetail[]
  }

  interface AllModel {
    data: Category[]
  }

  /**
   * Universal API response structure
   */
  interface ApiResponse<T> {
    code: number
    msg?: string
    message?: string
    data: T
  }
  interface GuideSearch {
    id: number
    author_id: number
    self_categories_id: number
    tag_id: number
    brand_id: number
    type: number
    name: string
    title: string
    introduction: string
    time_min: number
    time_max: number
    level: number
    conclusion: string
    img: string
    status: number
    is_delete: number
    read: number
    comments: number
    collections: number
    completeds: number
    created_at: string
    updated_at: string
    author_info: {
      id: number
      name: string
      account: string
      email: string
      phone: string
    }
    tag_info: {
      id: number
      name: string
      des: string
      img: string
      pid: number
      level: number
      created_at: string
      updated_at: string
      type: number
    }
    get_brand: {
      id: number
      name: string
      des: string
      img: string
      pid: number
      level: number
      created_at: string
      updated_at: string
      type: number
    }
  }

  interface OrderItemDetail {
    id: number
    order_id: number
    shop_part_id: number
    sku: string
    shop_part_name: string
    shop_part_url: string
    num: number
    reality_num: number
    sales_area: number
    price: string
    is_refund: number
    created_at: string
    updated_at: string
  }

  interface CustomerShipInfo {
    id: number
    user_id: number | null
    name: string
    country_code: string
    zipcode: string
    state_code: string
    city: string
    address1: string
    address2: string
    area: string | null
    phone: string | null
    email: string
    created_at: string
    updated_at: string
  }

  interface CompletedOrder {
    id: number
    user_id: number
    order_no: string
    status: number
    customer_id: number
    bill_customer_id: number
    total_amount: string
    due_amount: string
    express_no: string | null
    carrier_code: string
    service_code: string
    service_name: string
    logistics_cost: string
    discount: string
    discount_amount: string
    refund_amount: string | null
    tax: string
    tax_amount: string
    currency: string
    pay_time: string
    out_time: string | null
    payment_intent: string
    payment_method: string
    payment_status: number
    express_status: number
    sync_error_msg: string | null
    card_brand: string
    card_last_four: string
    tracking_url: string | null
    pdf_url: string | null
    note: string
    created_at: string
    updated_at: string
    shop_order_info_details: OrderItemDetail[]
    shop_customer_ship_info: CustomerShipInfo
    shop_bill_ship_info: CustomerShipInfo
  }
  interface LandingPageData {
    id: number
    user_id: number
    brand_id: number
    created_at: string
    updated_at: string
    landing_page: string
    logo_url: string
    banner_url: string
    banner_title: string
    banner_title_color: string
    banner_title_font_size: number
    brand_name: string
    basics_color: string
    suspend_color: string
    click_color: string
  }

  interface UserInfo {
    id: number
    account: string
    name: string
    email: string
    phone: string
    status: number
    email_verified_at: string | null
    remember_token: string | null
    last_login_time: string
    last_login_ip: string
    self_user_type: number
    permissions: number[]
    account_brand_id: number
    brand_name: string
  }
}

declare namespace App {
  interface FeaturedCategory {
    id: number
    name: string
    des: string
    img: string
    pid: number
    level: number
    created_at: string
    updated_at: string
    type: number
    tags_guides_count: number
  }
}

declare namespace App {
  interface PopularTutorial {
    id: number
    author_id: number
    self_categories_id: number
    tag_id: number
    brand_id: number
    type: number
    name: string
    title: string
    introduction: string
    time_min: number
    time_max: number
    level: number
    conclusion: string
    img: string
    status: number
    is_delete: number
    read: number
    comments: number
    collections: number
    completeds: number
    created_at: string
    updated_at: string
    reason: string | null
    author_info: {
      id: number
      name: string
      account: string
      email: string
      phone: string
      self_user_type: number
    }
    tag_info: {
      id: number
      name: string
      des: string
      img: string
      pid: number
      level: number
      created_at: string
      updated_at: string
      type: number
    }
    get_brand: {
      id: number
      name: string
      des: string
      img: string
      pid: number
      level: number
      created_at: string
      updated_at: string
      type: number
    }
  }
}
