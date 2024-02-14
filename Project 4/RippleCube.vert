#version 330 compatibility

uniform float uA, uB, uC, uD;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;


void
main( )
{    
	const float M_PI = 3.1415926535897932384626433832795;

	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	float r = sqrt(pow(vMC.x, 2) + pow(vMC.y, 2));
	newVertex.z = uA * cos(((2 * M_PI * uB * r) + uC) * exp(-uD * r));

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdr = uA * ( -sin(2.*M_PI*uB*r+uC) * 2.*M_PI*uB * exp(-uD*r) + cos(2.*M_PI*uB*r+uC) * -uD * exp(-uD*r));
	float drdx = vMC.x/r;
	float drdy = vMC.y/r;
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;
	vec3 xtangent = vec3(1., 0., dzdx );
	vec3 ytangent = vec3(0., 1., dzdy );

	vec3 newNormal = normalize( cross( xtangent, ytangent ) );
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	// vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}