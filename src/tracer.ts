'use strict'

import api from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/node'
import { SimpleSpanProcessor } from '@opentelemetry/tracing'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql'
import { W3CTraceContextPropagator } from '@opentelemetry/core'
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
// or
// const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')

export const tracer = (serviceName: any) => {
    const provider = new NodeTracerProvider()
    const graphQLInstrumentation = new GraphQLInstrumentation()
    graphQLInstrumentation.setTracerProvider(provider)
    graphQLInstrumentation.enable()

    api.propagation.setGlobalPropagator(new W3CTraceContextPropagator())
    api.trace.setGlobalTracerProvider(provider)

    provider.addSpanProcessor(
        new SimpleSpanProcessor(
            new ZipkinExporter({
                serviceName
            })
            // or
            // new JaegerExporter({
            //   serviceName,
            // })
        )
    )
    provider.register()
    return provider
}