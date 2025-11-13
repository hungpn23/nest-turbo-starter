import { Type } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  KafkaOptions,
  RmqOptions,
  TcpOptions,
} from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { MicroserviceName } from './microservice.enum';

export interface RmqMicroserviceOptions extends RmqOptions {
  serviceName: MicroserviceName;
}

export interface KafkaMicroserviceOptions extends KafkaOptions {
  serviceName: MicroserviceName;
}

export interface TCPMicroserviceOptions extends TcpOptions {
  serviceName: MicroserviceName;
}

export type MicroserviceConfigOptions =
  | RmqMicroserviceOptions
  | KafkaMicroserviceOptions
  | TCPMicroserviceOptions;

export type SupportedTransport = Transport.KAFKA | Transport.RMQ | Transport.TCP;

export interface MicroserviceClientDefinition {
  name: MicroserviceName;
  transport: SupportedTransport;
  options?: any;
}

export interface MicroserviceClientAsyncDefinition {
  name: MicroserviceName;
  transport: SupportedTransport;

  useFactory: (
    ...args: any[]
  ) =>
    | MicroserviceClientDefinition['options']
    | Promise<MicroserviceClientDefinition['options']>;
  inject?: (Type<any> | string | symbol)[];
}
