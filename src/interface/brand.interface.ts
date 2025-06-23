//export interface BrandData {
 //   name: string;
  //  description?: string;
 //   createAt:string;
  //  updateAt:string;
   // deleteAt:string;

//}

export interface Brand {
    id: number;
    name: string;
    description?: string;
    createAt: string;
    updateAt: string;
    deleteAt: string;
}
export interface BrandData {
    name: string;
    description?: string;

}
export interface BrandResponse {
    data: Brand[];
    total: number;
}