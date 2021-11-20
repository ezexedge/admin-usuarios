import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository);
    }


    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        const {data, meta} = await super.paginate(page, relations);

        return {
            //tengo que recorrer para ver los valores que uni
            //o modifique en la base de daatos
            //ya se name y total
            //si le cargo la data sin hacer un map no lo voy a poder ver
            //ver codigo de abajo de todo como ejemplo de respuesta
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items
            })),
            meta
        }
    }


    async chart(){
        return this.orderRepository.query(`
            SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum
            FROM orders o
            JOIN order_items i on o.id = i.order_id
            GROUP BY date;
        `);
    }

}


/*

{
    "data": [
        {
            "id": 1,
            "first_name": "ezequiel",
            "last_name": "gallardo",
            "email": "eze@gmail.com",
            "created_at": "2021-11-20T20:32:46.220Z",
            "order_items": [
                {
                    "id": 1,
                    "product_title": "sss",
                    "price": 12,
                    "quantity": 1
                },
                {
                    "id": 2,
                    "product_title": "wss",
                    "price": 11,
                    "quantity": 2
                }
            ]
        }
    ],
    "meta": {
        "total": 1,
        "page": 1,
        "last_page": 1
    }
}





///////
modificado

{
    "data": [
        {
            "id": 1,
            "name": "ezequiel gallardo",
            "email": "eze@gmail.com",
            "total": 34,
            "created_at": "2021-11-20T20:32:46.220Z",
            "order_items": [
                {
                    "id": 1,
                    "product_title": "sss",
                    "price": 12,
                    "quantity": 1
                },
                {
                    "id": 2,
                    "product_title": "wss",
                    "price": 11,
                    "quantity": 2
                }
            ]
        }
    ],
    "meta": {
        "total": 1,
        "page": 1,
        "last_page": 1
    }
}


*/